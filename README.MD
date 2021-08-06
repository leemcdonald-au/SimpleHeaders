## SimpleHeaders
Quick and simple method to parse to JSON or build from a string supplied HTTP headers.

##### Installation
Stock NPM install.
> npm install @leemcdonald-au/simpleheaders

##### Usage
```javascript
// Imports
import { SimpleHeaders } from '@leemcdonald-au/SimpleHeaders'
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
- TYPE: GET/POST/INPUT/DELETE.
- HOST: The requested subdomain: www
- PORT: The port the request was made on, 80, 443 or custom.
- PATH: The requested url. /path/to/index.html
- DOMAIN: Hostname for the request. lee-mcdonald.com

I added these 'cause I was gonna break them out anyway. May as well do it this side of the import.

##### Support
- RVN: RPzCvWdmgqPTBA5qMQFuRPfNoJmvPnVzw8
- ARK: Aeh9tR1zjE34hBrYfSD1EMfL1cxpkaVJKb
- ETH: 0xd9979f482da58b4432d0f52eb456f7dd1f4897e6
- BTC: 1HzR3Vyu231E8SsGLUbNYSb92bn6MGLEaV