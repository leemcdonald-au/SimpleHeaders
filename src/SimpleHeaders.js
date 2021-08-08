// Get available STATUS_CODES from node HTTP.
import { STATUS_CODES } from 'http'

// Create some symbols for this object.
const s = { type: Symbol('type'), path: Symbol('path'), host: Symbol('host'), domain: Symbol('domain'), port: Symbol('port') }

// It's a static class. I could export the functions but I like the Headers.build() asthetic.
export default class SimpleHeaders {
    // Build headers to send to a socket.
    static build(code, headers = {}) {
        // Keep an array of converted results.
        const result = [`HTTP/1.1 ${code} ${STATUS_CODES[code]}`]

        // Loop through object keys and add them as header results.
        Object.keys(headers).forEach(key => result.push(`${key}: ${headers[key]}`))

        // Return the final headers sting, appropriately joined.
        return result.join('\r\n') + '\r\n\r\n'
    }

    // Provide a simple HTML5 page.
    static html(title = "", content = "") { return `<!doctype html><html><head><meta charset="utf8"><title>${title}</title></head><body>${content}</body></html>` }

    // Provide a complete headers + html response.
    static reply(code, title, reason, headers) { return [SimpleHeaders.build(code, headers), SimpleHeaders.html(title, reason)].join('') }

    // Accept a string of headers and conver them into a handy object.
    constructor(headers = "") {
        // Cannot parse encrypted headers, return null.
        if(headers[0] === 22) return null

        // Some default values.
        this[s.type]    = null  // Type of the request.
        this[s.path]    = null  // Path the request wants.
        this[s.host]    = null  // hostname, subdomain
        this[s.domain]  = null  // TLDN of the request.
        this[s.port]    = null  // The port the request wants.

        // Make sure headers is a string and not a buffer or something.
        headers = headers.toString()

        // Split the headers by linebreaks.
        const splits = headers.split('\r\n')

        // First line contains the path and type of request.
        const pathtype = splits.splice(0, 1)[0]

        // Loop other headers and grab out the wanted data.
        splits.forEach(split => {
            // Break out the variable its value.
            const vari  = split.substring(0, split.indexOf(': '))
            const value = split.substring(split.indexOf(': ') + 2)

            // Append to the result object.
            if(vari && value) this[vari] = isNaN(value) ? value : Number(value) // Do number conversion.
        })

        // Host is a header we always expect to have, if we don't have it, something's gone arry.
        if(this.Host) {
            // Populate the PATH and TYPE values.
            this[s.type]   = pathtype.substring(0, pathtype.indexOf(' '))
            this[s.path]   = pathtype.substring(pathtype.indexOf(' ') + 1, pathtype.lastIndexOf(' '))

            // Grab out the port.
            if(this.Host.includes(':')) this[s.port] = Number(this.Host.substring(this.Host.indexOf(':') + 1))

            // Grab the port, host and domain values.
            if(this.Host.split('.').length > 2) {
                this[s.host]    = this.Host.substring(0, this.Host.indexOf('.'))
                this[s.domain]  = this.Host.substring(this.Host.indexOf('.') + 1)
            }

            // There isn't a subdomain present, just grab the host.
            else this[s.domain]  = this.Host

            // Split the port from the domain.
            if(this.port) this[s.domain] = this.domain.substring(0, this.domain.indexOf(":"))

            // Check whether we've come from HTTP or HTTPS by hopefully checking for a unique HTTPS header.
            else {
                if(this['Sec-Fetch-Mode'])  this[s.port] = 443
                else                        this[s.port] = 80
            }
        } 
        
        // No host is found, we can asusme any other parsing is useless at best.
        else return null
    }

    // Getters for the locked data.
    get TYPE()      { return this[s.type] }
    get PATH()      { return this[s.path] }
    get PORT()      { return this[s.port] }
    get HOST()      { return this[s.host] }
    get DOMAIN()    { return this[s.domain] }
}