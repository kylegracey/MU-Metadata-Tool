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
  this["Asset Name"] = obj["Asset Name"]
  this["Special Character Errors"] = []
  this["Mandatory Fields Missing"]= []
  this["Dependencies"]= []
  this["Invalid Options"] = []
  this["Created"]= []
  this["year"]= []
  this["Hidden Files"]= []
  this["Path to Assets"]= obj["Path to Assets"]
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
    MissingMandatory++
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
      SpecialCharCount++
    }
  }
}

// Check for Hidden Files Included
function hiddenFileCheck(value, errObject) {
  if (value.indexOf(".") == 0) {
    errObject.exists = true
    errObject["Hidden Files"].push("Hidden File Found!")
    HiddenFileCount++
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
          checkTags(obj, category, values, CritErrObject, DependencyCount)
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
    console.warn(`========== WARNING: ${CritErrObjects.length} FILES WITH CRITICAL ERRORS FOUND ==========`)
    if (MissingMandatory > 0) {console.log(`${MissingMandatory} Mandatory Categories Missing`)}
    if (SpecialCharCount > 0) {console.log(`${SpecialCharCount} Special Character Error(s)`)}
    if (HiddenFileCount > 0) {console.log(`${HiddenFileCount} Hidden File(s) Found`)}
  } else {
    writeLog({Errors:"No Critical Errors Found!"}, "_CriticalErrorLog")
  }

  if (MinorErrObjects.length > 0) {
    writeLog(MinorErrObjects, "_MinorErrorLog")
  } else {
    writeLog({Errors:"No Minor Errors Found!"}, "_MinorErrorLog")
  }

}

// const evalJSONLegacy = function(jsonInput) {
//   let errObjects = []
//   let critErrObjects = []
//
//   jsonInput.forEach(function(obj) {
//     // console.log(`Checking ${obj["Asset Name"]}`)
//     ErrObjectExists = false
//     CritErrObjectExists = false
//     let hasTag = false
//
//     let critErrObject = {
//       "Asset Name": obj["Asset Name"],
//       "Special Characters" : [],
//       "Mandatory Fields Missing": [],
//       "Created": [],
//       "year": [],
//       "Hidden Files": [],
//       "Path to Assets": obj["Path to Assets"]
//     }
//
//     let errObject = {
//       "Asset Name": obj["Asset Name"],
//       "Date": [],
//       "Tags": [],
//     }
//
//     // ======== Check Mandatory Fields ========
//     mandatoryFields.forEach(function(cat) {
//       if (obj[cat] == "" || obj[cat] == undefined) {
//         critErrObject["Mandatory Fields Missing"].push(cat)
//         CritErrorCount++
//         MissingMandatory++
//         CritErrObjectExists = true
//       }
//     })
//
//     // Check for Hidden files
//     if (obj["Asset Name"].indexOf(".") == 0) {
//       critErrObject["Hidden Files"].push("Hidden File Found!")
//       CritErrorCount++
//       HiddenFileCount++
//       CritErrObjectExists = true
//     }
//
//     // Date Formats
//     if (obj.Created.indexOf("-") == 4 && obj.Created.lastIndexOf("-") == 7) {
//       let CreatedArr = obj.Created.split('-')
//       for (let i=0; i<CreatedArr.length; i++) {
//         if (CreatedArr[i].match(/^[0-9]+$/) == null) {
//           CritErrorCount++
//           CreatedFormatErrCount++
//           CritErrObjectExists = true
//           critErrObject.Created.push("Created set to: " + obj.Created)
//         }
//       }
//     } else if (obj.Created) {
//       CritErrorCount++
//       CreatedFormatErrCount++
//       CritErrObjectExists = true
//       critErrObject.Created.push("Created set to: " + obj.Created)
//     }
//
//     if (obj.year !== undefined && obj.year !== "" && obj.year.match(/^[0-9]+$/) == null) {
//       CritErrorCount++
//       YearErrCount++
//       CritErrObjectExists = true
//       critErrObject.year.push("Year set to: " + obj.year)
//     }
//
//     // ======== Non-Mandatory Field Checks ========
//
//     if (obj.Created == "" || obj.Created == undefined) {
//       errObject.Date.push("Date Missing")
//       MinorErrorCount++
//       NoDateCount++
//       ErrObjectExists = true
//     }
//
//     // Check for Tags
//     tagCats.forEach(function(cat) {
//       if (obj[cat] !== "" && obj[cat] !== undefined) {
//         hasTag = true
//       }
//     })
//
//     if (!hasTag) {
//       errObject.Tags.push("No Tags Found!")
//       MinorErrorCount++
//       NoTagsCount++
//       ErrObjectExists = true
//     }
//
//     if (ErrObjectExists) { errObjects.push(errObject) }
//     if (CritErrObjectExists) { critErrObjects.push(critErrObject) }
//
//   })
//
//   if (CritErrorCount > 0) {
//     console.log(`
//       ========== WARNING: CRITICAL ERRORS FOUND ==========
//       ${critErrObjects.length} files with ${CritErrorCount} total critical errors found
//           ${SpecialCharCount} special characters found.
//           ${MissingMandatory} mandatory field(s) missing.
//           ${CreatedFormatErrCount} files with incorrectly formatted Created field.
//           ${YearErrCount} files with incorrectly formatted year.
//           ${HiddenFileCount} hidden files found.
//
//       These can cause major problems.
//       Fix files and Re-run script before uploading to Bynder
//       See Error log for details.
//       `);
//   } else {
//     console.log('No Critical errors found.')
//   }
//
//   if (MinorErrorCount > 0) {
//     console.log(`
//       ========== MINOR ERRORS FOUND ==========
//       ${errObjects.length} files with ${MinorErrorCount} minor errors found
//           ${NoTagsCount} files missing all tags.
//           ${NoDateCount} files with date warnings.
//       See Error log for details.
//       `);
//   } else {
//     console.log('No Minor errors found.')
//   }
//
//   writeLog(errObjects, "_MinorErrorLog")
//   writeLog(critErrObjects, "_CriticalErrorLog")
//
// }

module.exports = evalJSON
