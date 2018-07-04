/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var url = require('url');
var fs = require('fs');

var data = { results: [] };

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var currentId = 1;
var getObjectId = function() {
  var newID = ++currentId;
  newID = newID.toString();
  return newID;
};


exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  //response.writeHead(statusCode, headers);
  
  //fs.writeFile('classes/messages/messages.txt', 'hello world', (err) => { if (err) { throw err; } console.log('file saved'); });
  
  //fs.readFileSync(new URL('file://Users/warrentseng/Documents/GitHub/hrsf98-chatterbox-server/client/index.html'));
  /*fs.readFile('../client/index.html', function(err, data) {
    if (err) {
      throw err;
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    res.end();
  });*/
  // ../client/index.html

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  
  if (url.parse(request.url).pathname.slice(0, 8) === '/classes') {
    if (url.parse(request.url).pathname === '/classes/messages') {
      if (request.method === 'GET') {
        statusCode = statusCode || 200;
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(data));
      } else if (request.method === 'POST' || request.method === 'OPTIONS') {
        request.on('data', function(input) {
          var d = JSON.parse(input);
          d.objectId = getObjectId();
          d.createdAt = new Date();
          data.results.push(d);
        });
        response.writeHead(201, headers);
        response.end(JSON.stringify(data));
      }
    } else {
      response.writeHead(404, headers);
      response.end();
    }
  } else if (url.parse(request.url).pathname === '/') {
    headers['Content-Type'] = "text/html";

    //read in the file and send (async)
    fs.readFile("./client/index.html", {encoding: 'utf8'}, function (err,data) {
      if (err) {
        statusCode = 404;
      } 
      response.writeHead(statusCode, {'Content-Type': 'text/html'});
      response.end(data);
    });    
  } else {
    if (url.parse(request.url).pathname.slice(-3) === 'css') {
      var contentType = "text/css";
    } else {
      var contentType = "text/javscript";
    }

    //read file and send
    fs.readFile("./client"+url.parse(request.url).pathname, {encoding: 'utf8'}, function (err,data) {
      if (err) {
        //console.log('there is an error')
        statusCode = 404;
      }
      response.writeHead(statusCode, {'Content-Type': contentType});
      response.end(data);
    });    
  }

};
