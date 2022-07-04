//converts a level code to its data id
const codeToDataId = (code) => {
  code = code.replace(/-/g, "").toUpperCase()
  const letteringFix = {
    "B": "A",
    "C": "B",
    "D": "C",
    "F": "D",
    "G": "E",
    "H": "F",
    "J": "G",
    "K": "H",
    "L": "I",
    "M": "J",
    "N": "K",
    "P": "L",
    "Q": "M",
    "R": "N",
    "S": "O",
    "T": "P",
    "V": "Q",
    "W": "R",
    "X": "S",
    "Y": "T",
  }
  code = code.split("").reverse().map(el => letteringFix[el] ?? el).join("") // add vowels back to base 30 number
  const dataId = parseInt(code, 30).toString(2) // convert base 30 code to binary representation
  if (dataId == NaN) return undefined
  return dataId
}

// determines if a code is a maker code
const isMakerCode = (code) => {
  if (!code?.match(/^...-?...-?...$/)) return false
  return !!parseInt(codeToDataId(code).split("")[30])
}

exports.codeToDataId = codeToDataId
exports.isMakerCode = isMakerCode