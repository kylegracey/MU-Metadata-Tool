const fs = require('fs')

const evalTags = function(AllTags) {
  // Take in tags, count occurances, sort by most then write out to file
  let TagCounts = {}
  let TagCountArr = []
  let TagString = ""

  for (let i=0; i < AllTags.length; i++) {
    let tag = AllTags[i]
    TagCounts[tag] = TagCounts[tag] ? TagCounts[tag]+1 : 1
  }

  for (key in TagCounts) {
    TagCountArr.push([key, TagCounts[key]])
  }

  TagCountArr.sort(byNum)

  function byNum(a, b) {
    if (a[1] === b[1]) {
      return 0
    } else {
      return (a[1] < b[1]) ? 1 : -1
    }
  }

  TagCountArr.forEach(function(TagArr){
    TagString += `${TagArr[1]} - ${TagArr[0]}`
    TagString += "\n"
  })

  fs.writeFile('./files/_All-Tags.txt', TagString, function(err) {
    if (err) return console.log(err)
  })

}

module.exports = evalTags
