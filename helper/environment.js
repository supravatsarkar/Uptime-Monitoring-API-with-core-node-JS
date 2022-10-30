/*
 * Title : Node environment
 * Description : Node environment
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 */

// module scaffolding
const environment = {};

environment.dev = {
  port: 5000,
  envName: "development",
  secretKey: "dellfpff",
};

environment.production = {
  port: 5500,
  envName: "production",
  secretKey: "phsrpch",
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
