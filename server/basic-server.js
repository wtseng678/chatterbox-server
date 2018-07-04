/* Import node's http module: */
var http = require('http');
var requests = require('./request-handler.js');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Every server needs to listen on a port with a unique number. The
  // standard port for HTTP servers is port 80, but that port is
  // normally already claimed by another server and/or not accessible
  // so we'll use a standard testing port like 3000, other common development
  // ports are 8080 and 1337.
  var port = 3000;

  // For now, since you're running this server on your local machine,
  // we'll have it listen on the IP address 127.0.0.1, which is a
  // special address that always refers to localhost.
  var ip = '127.0.0.1';

  var router = {
    '/classes/messages': requests.requestHandler
  };

  var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
    'Content-Type': 'application/json'
  };


  // We use node's http module to create a server.
  //
  // The function we pass to http.createServer will be used to handle all
  // incoming requests.
  //
  // After creating the server, we will tell it to listen on the given port and IP. */
  var server = http.createServer(function(req, res) {
    console.log('Serving request type ' + req.method + ' for url ' + req.url);

    var route = router[url.parse(req.url).pathname];
    if (route) {
      route(req, res);
    } else {
      res.writeHead(404, headers);
      res.end('');
    }
  });
  console.log('Listening on http://' + ip + ':' + port);
  server.listen(port, ip);

  // To start this server, run:
  //
  //   node basic-server.js
  //
  // on the command line.
  //
  // To connect to the server, load http://127.0.0.1:3000 in your web
  // browser.
  //
  // server.listen() will continue running as long as there is the
  // possibility of serving more requests. To stop your server, hit
  // Ctrl-C on the command line.

}