const getDescription = function (obj) {
  if (obj.Description) {
    return obj.Description
  } else {
    return ""
  }
}

module.exports = getDescription
