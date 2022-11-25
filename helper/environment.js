/*
 * Title : Node environment
 * Description : Node environment
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 */

// dependencies
const creds = require("../creds");
// module scaffolding
const environment = {};

environment.dev = {
  port: 5000,
  envName: "development",
  secretKey: "dellfpff",
  maxChecks: 5,
  twilioCreds: {
    TWILIO_ACCOUNT_SID: creds.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: creds.AUTH_TOKEN,
    From: "+19498285845",
  },
};

environment.production = {
  port: 5500,
  envName: "production",
  secretKey: "phsrpch",
  maxChecks: 5,
  twilioCreds: {
    TWILIO_ACCOUNT_SID: creds.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: creds.AUTH_TOKEN,
    From: "+19498285845",
  },
};

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "dev";
console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
console.log("environment ", environment[process.env.NODE_ENV]);

const environmentToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment["dev"];

module.exports = environmentToExport;
