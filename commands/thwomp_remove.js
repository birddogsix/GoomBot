// remove a level from THWOMP data base

// requires
const tgr = require("../functions/tgrAPI")
const ThwompEntry = require("../models/ThwompEntry")

async function thwomp_remove(parameters, commandName, message) {

    const usage = `${commandName} LEV-ELC-ODE`

    const codes = parameters.filter(param => param.match(/...-...-.../))
    if (codes.length != 1) {
        return `The command \`${commandName}\` requires one level code. Use the command as follows: \`${usage}\``
    }
    const code = codes[0].replaceAll("-", "").toUpperCase()

    // get the level JSON
    let levelJSON = await tgr.levelSearch(code)

    // error from levelJSON
    if (levelJSON.error) return levelJSON.error

    // get the level from the data base
    const entry = await ThwompEntry.findOne({ "course.id": code })
    if (!entry) return `There is no level in THWOMP by that code.`

    // delete it
    await ThwompEntry.deleteOne({ "course.id": code })

    return `\`${entry.course.name}\` has been removed from THWOMP.`

}

exports.run = thwomp_remove