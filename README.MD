## SimpleHeaders
Quick and simple method to parse to JSON or build from a string supplied HTTP headers.

### Installation
Stock NPM install.
> npm install @leemcdonald-au/simpleheaders

### Usage
```javascript
// Imports
import SimpleHeaders from '@leemcdonald-au/SimpleHeaders'
import { createServer } from 'net'

// Create NET server.
const server = createServer(socket => {
    // Wait for socket to send data.
    socket.on('data', data => {
        // Convert string from buffer.
        data = data.toString()

        // Check if data is HTTP headers.
        if(data.includes('HTTP/1.1')) {
            const headers = new SimpleHeaders(data)
            socket.end(SimpleHeaders.build(500, { Connection: "closed", "Content-Type": "text/html" }) + SimpleHeaders.html('Error 500', '<b>Error 500</b>: Internal Server Error'))
            console.log(headers)
        }
    })

}).listen(6110)
```

The object includes five symbols accessed with getters for ease of breakdown. These are TYPE, HOST, PORT, PATH and DOMAIN. Pretty self-explainitory if you're in the know. Otherwise:
- TYPE: GET/POST/PUT/DELETE.
- HOST: The requested subdomain: www
- PORT: The port the request was made on, 80, 443 or custom.
- PATH: The requested url. /path/to/index.html
- DOMAIN: Hostname for the request. lee-mcdonald.com

I added these 'cause I was gonna break them out anyway. May as well do it this side of the import.

```javascript
// For quick reference.
console.log(headers.HOST)   // subdomain *if* present.
console.log(headers.DOMAIN) // FQDN
console.log(headers.PORT)   // Port the request was made. 80/443 if nft routes those requests as mine does.
console.log(headers.PATH)   // Path of the request.
console.log(headers.TYPE)   // GET/POST/PUT/DELETE

// SimpleHeaders.build(code, headers)   Return HTTP/1.1 200 OK to the last supplied header. Or whatever code you provide.
const r200 = SimpleHeaders.build(200, { "Content-Type": "text/html" })    // Everything is A-OK!
const r500 = SimpleHeaders.build(500, { "Content-Type": "text/html", Connection: 'closed' })  // Uhoh.

socket.end(r200 + "Everything worked out fine.")
socket.end(r500 + "Well someone done screwed up.")

// SimpleHeaders.html(title, content)   Returns <!doctype> to </html> HTML5 compliant code.
const rok   = SimpleHeaders.html('All Good', 'This request has ended here.')
const rer   = SimpleHeaders.html('Error', 'There has been an error.')

socket.end(r200 + rok)
socket.end(r500 + rer)

// SimpleHeaders.reply(code, title, content, keepAlive = false) Return a full headers + HTML compliant response. Kills connection by default.
const ohshi = SimpleHeaders.reply(500, 'Internal Server Error', 'There has been an internal server error, request cannot be answered.')
socket.end(ohshi)
```

### Changelog
- 1.0.4
    - Encrypted headers return null rather than throwing.
    - added close()

- 1.0.3
    - When a parse failed, headers were throwing on checks with null.function


### Support
- RVN: RPzCvWdmgqPTBA5qMQFuRPfNoJmvPnVzw8
- ARK: Aeh9tR1zjE34hBrYfSD1EMfL1cxpkaVJKb
- ETH: 0xd9979f482da58b4432d0f52eb456f7dd1f4897e6
- BTC: 1HzR3Vyu231E8SsGLUbNYSb92bn6MGLEaV