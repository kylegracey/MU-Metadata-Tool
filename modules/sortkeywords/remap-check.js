const getSetting = require('../get-setting')
const altKeywords = getSetting("Keyword Remaps")

const remapCheck = function(Keywords) {
  //Takes an array of keywords, loops through and remaps any of them.
  if (!Array.isArray(Keywords)) {
    Keywords = Keywords.split(', ')
  }

  let keywords = Keywords

  for (key in altKeywords) {
    for (let i = 0; i < keywords.length; i++) {
      if (altKeywords[key].indexOf(keywords[i]) !== -1) {
        // console.log(`Remap check: ${keywords[i]} to ${key}`)
        Keywords[i] = key
      }
    }
  }
  return keywords

}

module.exports = remapCheck
