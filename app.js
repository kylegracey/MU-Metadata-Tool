const fs = require('fs')
const csvjson = require('csvjson')

// MODULES
const trimExtension = require('./modules/trim-extension')
const getSetting = require('./modules/get-setting')
const groupSearch = require('./modules/group-search')
const sortKeywords = require('./modules/sort-keywords')
const getDescription = require('./modules/get-description')
const getCreateDate = require('./modules/get-create-date')
const writeCsvFile = require('./modules/write-csv')

// Evaluate & Debug
const evalJSON = require('./modules/eval-json')
const evalTags = require('./modules/eval-tags')

// Input and Output Options
// const inputPath = process.argv[2]
// const outputPath = process.argv[3]
const inputPath = './files/mutest.json'
const outputPath = './files/mutestoutput.csv'
const jsonData = require("./" + inputPath)

// Brand Settings
const brandfile = require('./config/brands/vml')
const brandID = brandfile.VML

const MassUpload = false

// Output Variables
let jsonOutput = []
let TagTracker = []

const joinArrays = function(obj) {
  //Find all arrays in new object and join them into a string for csv output
  for (var key in obj) {
      if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
         obj[key] = obj[key].join(',');
      }
  }
}

const parseMD = function(data) {
  // Loop through each object in Data
  data.forEach(function(obj) {
    // Get the object
    // let obj = data[i]
    // console.log(obj.FileName)
    let newObj = {
      "brand" : brandID,
      "name" : [],
      "filename" : obj.FileName,
      "tags" : [],
      "File Extension": [],
      "Group" : getSetting("Group"),
      "Client Team" : getSetting("Client Team"),
      "Asset Type" : [],
      "Asset Sub-Type" : [],
      "Year" : [],
      "Campaign" : [],
      "Product Group" : [],
      "Product" : [],
      "Product Size" : [],
      "Product Subtype" : [],
      "Product Gender" : [],
      "Number of People" : [],
      "Person" : [],
      "Team Marks" : [],
      "Gender" : [],
      "Shot Type" : [],
      "Sport" : [],
      "Asset Expired" : [],
      "Market" : [],
      "Platform Rights" : [],
      "Job ID" : []
    };
    trimExtension(obj, newObj)
    sortKeywords(obj, newObj)
    groupSearch(newObj)

    //Push tags into TagTracker
    for (let i = 0; i < newObj.tags.length; i++) {
      TagTracker.push(newObj.tags[i])
    }

    // Join arrays and push output
    joinArrays(newObj)
    jsonOutput.push(newObj)

  })

  writeCsvFile(jsonOutput, outputPath)
  evalJSON(jsonOutput)
  evalTags(TagTracker)

}

parseMD(jsonData)
