// show info on a level

// requires
const { level_embed } = require("../functions/level_info_embed")
const { maker_embed } = require("../functions/maker_info_embed")
const tgr = require("../functions/tgrAPI")

async function info(parameters, commandName, message) {

    const usage = `${commandName} VAL-IDC-ODE`

    const codes = parameters.filter(param => param.match(/...-...-.../))

    if (codes.length != 1) return `The command \`${commandName}\` requires one level code. Use the command as follows: \`${usage}\``

    const code = codes[0].replaceAll("-", "").toUpperCase()

    let JSON = await tgr.levelSearch(code)

    if (JSON?.error == "Code corresponds to a maker") {
        JSON = await tgr.makerSearch(code)
        if (JSON.error == "No user with that ID") return `The code you have entered does not correspond to a maker or level. Use the command as follows: \`${usage}\``
        const embedInfo = await maker_embed(JSON)
        return embedInfo
    } else if (!JSON?.error) {
        const embedInfo = await level_embed(JSON)
        return embedInfo
    } else if (JSON?.error == "Something went wrong when trying to gather the information. Please try again in a few minutes.") {
        return JSON.error
    } else {
        return `The code you have entered does not correspond to a maker or level. Use the command as follows: \`${usage}\``
    }

}

exports.run = info