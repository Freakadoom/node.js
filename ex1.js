    const http = require('http');
    http.createServer( function(requset, response){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('Hello, World!');
    }).listen(8080);
    console.log('Server running on 8080');
