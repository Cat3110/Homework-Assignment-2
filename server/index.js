/*
 * Web server
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var path = require('path');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

var config = require('../config');

// Server object
var server = {};

// HTTP and HTTPS servers
server.httpServer = http.createServer(function(req, res) {
    server.unifiedServer(req, res);
});

server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
    server.unifiedServer(req, res);
});

// Unified server logic for both http and https
server.unifiedServer = function(req, res) {

  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');

  // Get the method
  var method = req.method.toLowerCase();

  // Get the headers
  var headers = req.headers;

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data) {
    buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer += decoder.end();

    // Construct the data object for handler:

    var data = {
      'path' : path,
      'method' : method,
      'headers' : headers,
      'queryStringObject' : queryStringObject,
      'payload' : buffer
    };

    console.log(data);

    res.end();

  });



}

// Init script
server.init = function(){
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, function() {
    console.log('\x1b[36m%s\x1b[0m',"The server is listening on port " + config.httpPort);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function() {
    console.log('\x1b[35m%s\x1b[0m',"The server is listening on port " + config.httpsPort);
  });
}

// Export server
module.exports = server;
