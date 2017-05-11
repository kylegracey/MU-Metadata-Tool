//NEED TO REFACTOR THIS TO USE TAXONOMY STRUCTURE INSTEAD
const getSetting = require('./get-setting')

const sortHS = require('./sortkeywords/sort-hs')
const remapCheck = require('./sortkeywords/remap-check')
const wordSearch = require('./sortkeywords/word-search')

const fontFileTypes = getSetting("Font File Types")

const sortKeywords = function(obj, newObj) {
  let newObjTags = []
  if (obj.HierarchicalSubject) {
    sortHS(obj.HierarchicalSubject, newObj)
  } else if (obj.Keywords) {
    wordSearch(remapCheck(obj.Keywords), newObj)
  } else if (obj.Subject) {
    wordSearch(remapCheck(obj.Subject), newObj)
  } else {
    (`!!!!Warning!!!! ${obj.FileName} has no keywords!!!!`)
  }

  // Keyword fallbacks

  // Asset Type Fallback by FileName
  if (newObj["Asset Type"].length == 0) {
    for (var filetype of fontFileTypes) {
      if (newObj["File Extension"] == filetype) {
        newObj["Asset Type"].push("Fonts")
      }
    }
  }

}

module.exports = sortKeywords
