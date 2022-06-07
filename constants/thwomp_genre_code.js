const OSs = ["os", "osp", "onescreen", "onescreenpuzzle", "one-screenpuzzle"]
const ERs = ["er", "escaperoom", "escaperoompuzzle"]
const EMs = ["em", "etm", "escapethemansion", "escapethemansionpuzzle"]
const THs = ["th", "themed", "themedpuzzle"]

const genreToCode = {
    ...OSs.reduce((obj, key) => ({ ...obj, [key]: "os"}), {}),
    ...ERs.reduce((obj, key) => ({ ...obj, [key]: "er"}), {}),
    ...EMs.reduce((obj, key) => ({ ...obj, [key]: "em"}), {}),
    ...THs.reduce((obj, key) => ({ ...obj, [key]: "th"}), {}),
}

const codeToGenre = {
    "os": "One screen puzzle",
    "er": "Escape room",
    "em": "Escape the mansion",
    "th": "Themed puzzle"
}

exports.gtc = genreToCode
exports.ctg = codeToGenre