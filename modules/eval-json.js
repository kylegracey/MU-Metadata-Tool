const fs = require('fs')
const csvjson = require('csvjson')
const evalsettings = require('../config/eval-settings.json')

// Modules
const checkTags = require('./eval-dependencies')

// Settings
const CheckSpecialCharacters = true
const SpecialCharacters = /[,!@#$%^&*=\[\]{};"\\|<>\/?]+/;

const mandatoryFields = evalsettings["Mandatory Fields"]
const TagCheckCats = evalsettings["Tag Check Categories"]

// Error Object Structure
function ErrObject(obj) {
  this.exists = false
  this["Asset Name"] = obj.name
  this["Special Character Errors"] = []
  this["Mandatory Fields Missing"]= []
  this["Dependencies"]= []
  this["Invalid Options"] = []
  this["Created"]= []
  this["year"]= []
  this["Hidden Files"]= []
}

let ErrCounter = {
  "Critical": {
    "SpecialChar": 0,
    "MissingMandatory": 0,
    "Dependency": 0,
    "HiddenFile": 0
  },
  "Minor": {
    "NoDate": 0,
    "NoTags": 0
  }
}
// Counters
// let CritErrorCount = 0
let SpecialCharCount = 0
let MissingMandatory = 0
let DependencyCount = 0
let CreatedFormatErrCount = 0
let YearErrCount = 0
let HiddenFileCount = 0

let MinorErrorCount = 0
let NoDateCount = 0
let NoTagsCount = 0

const writeLog = function(logData, fname) {

  // Convert jsonOutput back to CSV
  const jsonToCsvOptions = {
      headers   : "key",
      delimiter   : ";"
  }
  const csvOutput = csvjson.toCSV(logData, jsonToCsvOptions);

  fs.writeFile(`./files/${fname}.csv`, csvOutput, function (err) {
    if (err) return console.log(err);
  })
}

// Check if category is mandatory. If so, it's empty and needs to be flagged.
function checkMandatoryCategories(category, errObject) {
  if (mandatoryFields.indexOf(category) !== -1) {
    errObject.exists = true
    ErrCounter.Critical.MissingMandatory++
    errObject["Mandatory Fields Missing"].push(category)
  }
}

// Check for Special Characters
function charCheck(category, values, errObject) {
  for (var value of values) {
    if (SpecialCharacters.test(value)) {
      let errString = `${value} in ${category}`
      errObject.exists = true
      if (errObject["Special Character Errors"].indexOf(errString) == -1) {
        errObject["Special Character Errors"].push(errString)
      }
      ErrCounter.Critical.SpecialChar++
    }
  }
}

// Check for Hidden Files Included
function hiddenFileCheck(value, errObject) {
  if (value.indexOf(".") == 0) {
    errObject.exists = true
    errObject["Hidden Files"].push("Hidden File Found!")
    ErrCounter.Critical.HiddenFile++
  }
}

const evalJSON = function(jsonInput) {
  let CritErrObjects = []
  let MinorErrObjects = []

  jsonInput.forEach(function(obj) {
    // console.log(`Checking ${obj["Asset Name"]}`)
    let CritErrObject = new ErrObject(obj)
    let MinorErrObject = new ErrObject(obj)

    for (category in obj) {
      if (obj[category] !== "") {
        // If there is at least 1 value under this category
        const values = obj[category].split(",")

        if (category == "Asset Name") {
          hiddenFileCheck(values[0], CritErrObject)
        }

        // Tag Categories
        if (TagCheckCats.indexOf(category) !== -1) {
          checkTags(obj, category, values, CritErrObject, ErrCounter)
        }

        // Check all categories except Path to Assets
        if (category !== "Path to Assets") {
          charCheck(category, values, CritErrObject)
        }

      } else {
        // If no values under that category
        checkMandatoryCategories(category, CritErrObject)
      }
    }

    if (CritErrObject.exists) {
      delete CritErrObject.exists
      CritErrObjects.push(CritErrObject)
    }

    if (MinorErrObject.exists) {
      delete MinorErrObject.exists
      MinorErrObjects.push(CritErrObject)
    }

  })

  if (CritErrObjects.length > 0) {
    writeLog(CritErrObjects, "_CriticalErrorLog")
    console.log(ErrCounter.Critical)
    console.warn(`========== WARNING: ${CritErrObjects.length} FILES WITH CRITICAL ERRORS FOUND ==========`)
    if (MissingMandatory > 0) {console.log(`${MissingMandatory} Mandatory Categories Missing`)}
    if (SpecialCharCount > 0) {console.log(`${SpecialCharCount} Special Character Error(s)`)}
    if (HiddenFileCount > 0) {console.log(`${HiddenFileCount} Hidden File(s) Found`)}
  } else {
    writeLog({Errors:"No Critical Errors Found!"}, "_CriticalErrorLog")
  }

  if (MinorErrObjects.length > 0) {
    console.log(ErrCounter.Minor)
    writeLog(MinorErrObjects, "_MinorErrorLog")
  } else {
    writeLog({Errors:"No Minor Errors Found!"}, "_MinorErrorLog")
  }

}

module.exports = evalJSON
