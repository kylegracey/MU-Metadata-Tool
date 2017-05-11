const remapCheck = require('./remap-check')
const wordSearch = require('./word-search')

const sortHSLogic = function(hsArr, newObj) {

  if (hsArr.length == 1) {
  // If Single Tier
  // Expired or just a tag
    if (hsArr[0] == "Expired") {
      // Asset is Expired
      if (!newObj.MassUpload && newObj.assetstatus.indexOf("Expired") == -1) {
        newObj.assetstatus.push("Expired")
      } else if (newObj.MassUpload && newObj["Asset Expired"].indexOf("Expired") == -1) {
        newObj["Asset Expired"].push("Expired")
      }

    } else {
      // It's a tag
      wordSearch(hsArr[0], newObj)
    }
  } else {
    // Two+ tier

    // Start
    let category = hsArr[0]
    if(!newObj.MassUpload) {
      category = hsArr[0].toLowerCase().replace(/\s/g, '');
    }

    if (newObj.hasOwnProperty(category)) {
      // If category matches one in object, push the second string from array into appropriate category.

      if(newObj[category].indexOf(hsArr[1]) == -1) {
        newObj[category].push(hsArr[1])
      }
    } else {
      // Didn't find a category match. Need to check keywords.
      wordSearch(hsArr[1], newObj)
    }

    if (hsArr[2]) {
      wordSearch(hsArr[2], newObj)
    }

    if (hsArr.length > 3) {
      console.log(`===WARNING===
        Found a 4+ tier array. Fourth tier + will not be logged.`)
    }

  }
}

const sortHS = function (objHS, newObj) {
  // Input Example:
  // [ 'Asset Type|Product Renders', 'Product|Protein Powder|Individual Packet', 'Asset Expired' ]
  // !! Single example: Not array !! ex: 'Asset Type|Product Renders'

  // If string, convert to array
  if (typeof objHS == "string") {
    let hsArr = objHS.split('|')
    sortHSLogic(remapCheck(hsArr), newObj)
  } else if (Array.isArray(objHS)) {
    // If already array
    objHS.forEach(function(hs) {
      // For each string containing a set of hierarchical subject tags. Ex:
      // 'Product|Protein Powder|Individual Packet'
      hsArr = hs.split('|')

      // Gx to Gx bottle exception for campaign.
      if (hsArr[0] == "Campaign") {
        sortHSLogic(hsArr, newObj)
      } else {
        sortHSLogic(remapCheck(hsArr), newObj)
      }

    })
  }

}

module.exports = sortHS
