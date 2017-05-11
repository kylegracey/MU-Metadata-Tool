const fs = require('fs')
const csvjson = require('csvjson')
const evalJSON = require('./modules/eval-json')

const CsvPath = process.argv[2]

const csvjsonOptions = {
    // headers   : "key",
    delimiter   : ";"
}

const readConvert = function() {
  fs.readFile(CsvPath, 'utf8', parseCB);
}

const parseCB = function(err, data) {
  let jsonData = csvjson.toObject(data, csvjsonOptions);
  evalJSON(jsonData)
}

if (CsvPath == undefined) {
  console.log('No path specified. Try again.')
} else {
  readConvert()
}
