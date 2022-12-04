/*
 * Title : Server file
 * Description : It is server file. main server start from here.
 * Author : Supravat Sarkar
 * Date : 30/11/2022
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("../helper/handleReqRes");
const environment = require("../helper/environment");

// server object - module scaffolding
const server = {};

// create server

server.createServer = () => {
  const createServer = http.createServer(server.handleReqRes);
  createServer.listen(environment.port, () => {
    console.log(`Server run on port ${environment.port}`);
  });
};

// handle req res

server.handleReqRes = handleReqRes;

server.init = () => {
  //create the server
  server.createServer();
};

// export
module.exports = server;
