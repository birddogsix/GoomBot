const thwompGenres = {
    "os": /^osp?|one(?:\s|-)*screen\s*(?:puzzle)?$/,
    "er": /^erp?|escape\s*room\s*(?:puzzle)?$/,
    "em": /^et?mp?|escape\s*the\s*mansion\s*(?:puzzle)?$/,
    "th": /^thp?|themed\s*(?:puzzle)?$/,
}
const getThwompGenreCode = (str) => typeof str == "string" ? Object.keys(thwompGenres).find(key => str.match(thwompGenres[key])) : undefined

const codeToGenre = {
    "os": "One screen puzzle",
    "er": "Escape room",
    "em": "Escape the mansion",
    "th": "Themed puzzle"
}

exports.getThwompGenreCode = getThwompGenreCode
exports.ctg = codeToGenre
exports.thwompGenreRegEx = thwompGenres