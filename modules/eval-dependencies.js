const taxonomy = require('../config/taxonomy-structure')

function getMetapropertyOptions(name) {
  let mp = ""
  for (var obj of taxonomy) {
    if (obj.Label == name) {
      mp = obj.Options
    }
  }
  return mp
}

function getLabelByMetaproperty(mp) {
  for (var obj of taxonomy) {
    if (obj.Metaproperty == mp) {
      return obj.Label
    }
  }
}

const checkTags = function (obj, category, values, CritErrObject, ErrCounter) {
  const MpOptions = getMetapropertyOptions(category)
  for (var value of values) {
    let ValidTag = false

    for (var MpOption of MpOptions) {
      if (value == MpOption.Label) {
        // console.log(`found match between ${value} and ${MpOption.Label}`)
        ValidTag = true

        if (MpOption.Dependencies !== undefined) {
          let ValidDependency = false
          for (mp in MpOption.Dependencies) {
            //For each type of dependency (by metaproperty)
            for (var dependency of MpOption.Dependencies[mp]) {
              let Label = getLabelByMetaproperty(mp)
              let dependencyTerms = obj[Label].split(",")
              for (term of dependencyTerms) {
                if (term == dependency) {
                  // console.log(`${term} matches ${dependency}`)
                  ValidDependency = true
                }
              }
            }
          }

          // If checked all dependencies and didn't find a match, trigger error.
          if (!ValidDependency) {
            CritErrObject.exists = true
            CritErrObject["Dependencies"].push(`${category}: '${value}' has incompatible dependencies!`)
            ErrCounter.Critical.Dependency++
          }
        }

      }
    }

    if (!ValidTag) {
      CritErrObject.exists = true
      ErrCounter.Critical.Options++
      CritErrObject["Invalid Options"].push(`${category}: '${value}'`)
    }

  }

}

module.exports = checkTags
