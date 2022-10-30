/*
 * Title : Library for fs database;
 * Description : Library for creating file system database
 * Author : Supravat Sarkar
 * Date : 27/10/2022
 */

// dependencies
const fs = require("fs");
const { truncate } = require("fs/promises");
const path = require("path");
//module scaffolding
const lib = {};

// base directory of data folder
lib.basedir = path.join(__dirname, "../.data/");
// console.log(lib.basedir);
// write data to  file
lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringifyData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringifyData, (err2) => {
        if (err2) {
          callback("Error to writing file: ", err2);
        } else {
          fs.close(fileDescriptor, (err3) => {
            if (err3) {
              callback("Error to closing file: ", err3);
            } else {
              callback(null);
            }
          });
        }
      });
    } else {
      callback("File not created. file may already file exist.");
    }
  });
};

// read data to file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// update data to existing file
lib.update = (dir, file, data, callback) => {
  // file opening
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringifyData = JSON.stringify(data);
      // file truncate
      fs.ftruncate(fileDescriptor, (err2) => {
        if (err) {
          callback("Error to file truncate.", err2);
        } else {
          fs.writeFile(
            `${lib.basedir + dir}/${file}.json`,
            stringifyData,
            (err3) => {
              if (err3) {
                callback("Error to file write", err3);
              } else {
                fs.close(fileDescriptor, (err4) => {
                  if (err4) {
                    callback("Error to close file: ", err4);
                  } else {
                    callback(null);
                  }
                });
              }
            }
          );
        }
      });
    } else {
      callback("Error to update file. May file not exist", err);
    }
  });
};

// delete existing file
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (err) {
      callback("Error to delete file", err);
    } else {
      callback(null);
    }
  });
};

module.exports = lib;
