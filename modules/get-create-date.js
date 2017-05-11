// Take date, remove time, reformat if needed and return proper date.
function baseFormat(date) {
  // Format: 2014:11:19 18:56:12-05:00
  // Format: 2014:11:19
  let rawDate = date.substring(0, 10);
  let fDate = rawDate.split(':').join('-');
  return fDate;
}
function formatTwo(date) {
  // Format: 4/14/15
  let rawDateArr = date.split('/')
  let year = rawDateArr[2]
  if (year.length == 2) {
    year = "20" + year
  }

  let month = rawDateArr[0]
  if (month.length < 2) {
    month = "0" + month
  }

  let day = rawDateArr[1]
  if (day.length < 2) {
    day = "0" + day
  }
  const sortDateArr = [year, month, day]
  return sortDateArr.join('-')
}

function getCreateDate(obj) {
  const dateHeaders = ["CreateDate", "CreatedDate", "DateCreated", "DateTimeCreated", "DateTimeOriginal"]
  let formattedDate = ""
  for (let i = 0; i < dateHeaders.length; i++) {
    let header = dateHeaders[i]
    if (formattedDate == "") {
      if (obj[header] !== undefined) {
        if (obj[header].indexOf("/") !== -1) {
          formattedDate = formatTwo(obj["CreateDate"])
        } else if (obj[header].indexOf(":" == 4)) {
          formattedDate = baseFormat(obj["CreateDate"])
        } else {
          console.log(obj.SourceFile + "Does not have a recognizable date")
        }
      }
    }
  }

  return formattedDate

}

module.exports = getCreateDate
