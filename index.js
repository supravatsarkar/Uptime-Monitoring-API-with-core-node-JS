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
const { sendTwilioSms } = require("./helper/notification");

// sendTwilioSms("9733810712", "Hi this test", (err) => {
//   if (!err) {
//     console.log("Message sent success");
//   } else {
//     console.log("Message sent Error:", err);
//   }
// });

// app object - module scaffolding
const app = {};

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
