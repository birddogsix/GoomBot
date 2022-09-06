const replacements = {
    "auto scroll": /auto(?:\s?scroll)?/,
    "puzzle genre": /puzzle\s?genres?/,
    "puzzle tag": /puzzle\s?tags?/,
    "short and sweet": /short\s?and\s?sweet/,
    "puzzle solving": /puzzle(?:\s|-)?solving/,
    "multiplayer versus": /multiplayer(?:\s?v(?:ersu)?s)?/,
    "boss battle": /boss(?:\s?battle)?/,
    "single player": /single\s?player/,
    "one screen puzzle": /osp?|one(?:\s|-)?screen(?:\s?puzzle)?/,
    "escape the mansion": /et?m|escape\s?the\s?mansion(?:\s?puzzle)?/,
    "escape room": /et?m|escape\s?room(?:\s?puzzle)?/,
    "super expert": /super\s?expert/,
    "themed puzzle": /themed\s?puzzle/,
}

const replaceTerms = (str) => {
    Object.keys(replacements).forEach(replacement => {
        str = str.replace(new RegExp(`(?<=\\s|^)([a-z]+:)?${replacements[replacement].source}(?=\\s|$)`, "g"), `$1\(${replacement}\)`)
    })
    return str
}

const combineTerms = (str) => {
    Object.values(replacements).forEach(regEx => {
        str = str.replace(new RegExp(`(?<=\\s|^)([a-z]+:)?(${regEx.source})(?=\\s|$)`, "g"), `$1\($2\)`)
    })
    return str
}

exports.replacements = replacements
exports.formatTerms = replaceTerms
exports.combineTerms = combineTerms