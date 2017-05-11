const fs = require('fs');
const csvjson = require('csvjson');

let mdConvert = function(path) {
  console.log('Reading file: ' + path)
  fs.readFile(path, 'utf8', toCSV)
}

let toCSV = function(err, data) {
  const jsonInput = csvjson.toObject(data);
  console.log(jsonInput)
}

let logFile = function(err, data) {
  if (err) {
    console.error(err)
  } else {
    console.log("Finished reading file.")
    console.log(data.split('\n').length + " lines read.")
  }
}

module.exports = mdConvert
