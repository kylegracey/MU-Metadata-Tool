// Trim any extension off the file name or if there isn't an extension, return the current asset name.
// module.exports = function trimExtension(obj, newObj) {
//   if (obj.FileName != null){
//     var fName = obj.FileName;
//     return fName.replace(/\.[^/.]+$/, "");
//   } else {
//     return obj["Asset Name"];
//   }
// }

const trimExtension = function(obj, newObj) {
  let fileArr = obj.FileName.split(".")
  let extension = fileArr.pop().toLowerCase()

  newObj["Asset Name"] = fileArr.join(".")
  newObj.fileextension = extension

}

module.exports = trimExtension
