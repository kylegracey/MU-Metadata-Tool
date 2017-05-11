var settings = require('../config/settings-propel.json');

// Gets a specific setting by it's name
module.exports = function getSetting(key){
  var setting;
  settings.forEach(function(elm){
    var output = elm[key];
    setting = output;
  });
  return setting;
}
