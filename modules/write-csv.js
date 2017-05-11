const fs = require('fs')
const csvjson = require('csvjson')

const writeCsvFile = function(data, outputPath) {
  // Convert jsonOutput back to CSV
  const jsonToCsvOptions = {
      headers   : "key",
      delimiter   : ";"
  }
  const csvOutput = csvjson.toCSV(data, jsonToCsvOptions);

  // Write CSV to output file
  fs.writeFile(outputPath, csvOutput, function (err) {
    if (err) return console.log(err);
    console.log('Writing to csv/output.csv');
  });

}

module.exports = writeCsvFile
