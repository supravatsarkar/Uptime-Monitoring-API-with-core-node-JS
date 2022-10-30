/*
 * Title : Uptime monitoring application
 * Description : A RESTfull api for uptime or downtime user define links
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
const environment = require("./helper/environment");
const data = require("./lib/data");

// app object - module scaffolding
const app = {};

// this is for testing fs database;

// data.create("test", "newFile", { name: "supravat", age: 29 }, (err) => {
//   if (err) {
//     console.log(err);
//   }
// });
// data.read("test", "newFile", (err, data) => {
//   console.log(err, data);
// });
// data.update("test", "newFile", { name: "Barsha", age: 18 }, (err) => {
//   console.log(err);
// });
// data.delete("test", "newFile", (err) => {
//   console.log(err);
// });

// create server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Server run on port ${environment.port}`);
  });
};

// handle req res

app.handleReqRes = handleReqRes;

//start the server
app.createServer();
