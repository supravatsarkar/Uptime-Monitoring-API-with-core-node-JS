/*
 * Title : Uptime monitoring application
 * Description : Initial file to start the server and worker process.
 * Author : Supravat Sarkar
 * Date : 30/11/2022
 */

// dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");

// app object - module scaffolding
const app = {};

// app init function
app.init = () => {
  // start the server
  server.init();
  // start the worker
  worker.init();
};

app.init();

// export
module.exports = app;
