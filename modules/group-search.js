const getSetting = require('./get-setting.js');

// Settings
const ProductGroups = getSetting("Product Groups");

const groupSearch = function(newObj) {
  // Get array of products
  let products = []
  products = newObj.Product
  
  // For each product in the products array
  for (let i = 0; i < products.length; i++) {
    for (group in ProductGroups) {
      if (ProductGroups[group].indexOf(products[i]) !== -1) {

        if (!newObj.MassUpload && newObj.productgroup.indexOf(group) == -1) {
          newObj.productgroup.push(group)
        } else if (newObj.MassUpload && newObj["Product Group"].indexOf(group) == -1) {
          newObj["Product Group"].push(group)
        }

      }
    }
  }

}

module.exports = groupSearch
