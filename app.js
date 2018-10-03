/*
 * Core of application
 *
 */

 // Dependencies
 var server = require('./server');

 // Declare the app
 var app = {};

 // Init function
 app.init = function() {
   // Start the server
   server.init();
 };

 // Execute the app
 app.init();
