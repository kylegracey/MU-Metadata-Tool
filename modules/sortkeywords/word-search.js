const getSetting = require('../get-setting')
const KeywordCats = getSetting("KeywordCats")

const altKeywords = getSetting("Keyword Remaps")

const wordSearch = function(objKeywordArr, newObj) {
  // If a string is passed in, make it an array
  if (!Array.isArray(objKeywordArr)) {
    objKeywordArr = [objKeywordArr]
  }

  // Look for altKeywords and remap any matches
  for (key in altKeywords) {
    for (let i = 0; i < objKeywordArr.length; i++) {
      if (altKeywords[key].indexOf(objKeywordArr[i]) !== -1) {
        objKeywordArr[i] = key
      }
    }
  }

  // Check all keywords for matches and push them into the appropriate category in newObj
  for (let i=0; i < objKeywordArr.length; i++) {
    //If it's a year, push to newObj.year
    if (typeof objKeywordArr[i] == 'number' && objKeywordArr[i].toString().length == 4) {
      if (newObj.year.indexOf(objKeywordArr[i]) == -1) {
        newObj.year.push(objKeywordArr[i])
      }
    } else {

      let foundKeyword = false

      for (Cat in KeywordCats) {

        if (KeywordCats[Cat].indexOf(objKeywordArr[i]) !== -1) {
          foundKeyword = true
          // Found a match in this category's array
          let category = Cat

          if (category == "Asset Subtype") {
            category = "Asset Sub-Type"
          } else if (category == "Marks") {
            category = "Team Marks"
          }

          // Check if tag exists in category already. If not, push into newObj[category]
          console.log(`Found a match! Pushing ${objKeywordArr[i]} into ${category}`)
          if(newObj[category].indexOf(objKeywordArr[i]) == -1) {
            newObj[category].push(objKeywordArr[i])
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
