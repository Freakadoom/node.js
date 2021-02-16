
const http = require('http'),
      url = require('url'),
      fs = require('fs'), 
      pid = process.pid;

var server = http.createServer(function(request, response) {

    // console.log(request.url);

    var fromURL = url.parse(request.url);

    var options = {
          port: fromURL.port
        , hostname: fromURL.hostname
        , method: request.method
        , path: fromURL.path
        , headers: request.headers
    };

    var proxyRequest = http.request(options);

    proxyRequest.on('response', function (proxyResponse) {
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers); // имеет смысл перенести вниз после всех слушателей событий
        proxyResponse.on('data', function (chunk) {
            response.write(chunk, 'binary');
        });
        proxyResponse.on('end', function() {
            response.end();
        });
        proxyResponse.on('error', function (err) {
            console.log('Error with client ', err);
        });
        // console.log(proxyResponse);
    });

    request.on('data', function (chunk) {
        proxyRequest.write(chunk, 'binary')
    });
    request.on('end', function () {
        proxyRequest.end()
    });
    request.on('error', function (err) {
        console.log('Problem with request ', err);
    });

    var ip = request.headers['x-forwarded-for'] || 
    request.connection.remoteAddress || 
    request.socket.remoteAddress ||
    (request.connection.socket ? request.connection.socket.remoteAddress : null);

    function timeNow() {	
        function pad(n) {
          return n<10 ? "0"+n : n
        }
        var now = new Date();
        return "[<" + pad(now.getFullYear()) + 
        "-" + pad(now.getMonth()) + "-" + 
        pad(now.getDate()) + "> " + 
        pad(now.getHours()) + ":" + 
        pad(now.getMinutes()) + ":" + 
        pad(now.getSeconds()) + "]";
      }	

    const message = ` ${timeNow()} IP пользователя: ${ip}   Тип запроса: ${request.method}   URL: ${JSON.stringify(fromURL)}`;
    fs.writeFile('log.txt', message, function(err, data) {});


});

server.listen(8080, () => {
    console.log(`http-proxy-server started. Pid: ${pid}`)
});
