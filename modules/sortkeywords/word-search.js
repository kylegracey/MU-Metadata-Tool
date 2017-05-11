const getSetting = require('../get-setting')
const taxonomy = require('../../config/taxonomy-structure')

// const KeywordCats = getSetting("KeywordCats")

const wordSearch = function(objKeywordArr, newObj) {
  // If a string is passed in, make it an array
  if (!Array.isArray(objKeywordArr)) {
    objKeywordArr = [objKeywordArr]
  }


  // Check all keywords for matches and push them into the appropriate category in newObj
  for (let i=0; i < objKeywordArr.length; i++) {
    //If it's a year, push to newObj.year
    if (typeof objKeywordArr[i] == 'number' && objKeywordArr[i].toString().length == 4) {
      if (newObj.Year.indexOf(objKeywordArr[i]) == -1) {
        newObj.Year.push(objKeywordArr[i])
      }
    } else {
      let foundKeyword = false

      for (var obj of taxonomy) {
        const category = obj.Label
        for (var valueObj of obj.Options) {
          const value = valueObj.Label
          if (value == objKeywordArr[i]) {
            // console.log(`Pushing ${value} into ${category}`)
            foundKeyword = true
            if (newObj[category].indexOf(value) == -1) {
              newObj[category].push(value)
            }
          }
        }
      }

      // If tag isn't found in any of the keyword categories, add to tags
      if (!foundKeyword) {
        if (newObj.tags.indexOf(objKeywordArr[i]) == -1) {
          newObj.tags.push(objKeywordArr[i])
        }
      }
    }

  }

}

module.exports = wordSearch
