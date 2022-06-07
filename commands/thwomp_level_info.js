// display information on a single level code you submitted in THWOMP

const { thwomp_level_embed } = require("../functions/thwomp_level_info_embed")
const ThwompEntry = require("../models/ThwompEntry")

// requires

async function thwomp_level_info(parameters, commandName, message) {
    
    const usage = `${commandName} LEV-ELC-ODE`

    const codes = parameters.filter(param => param.match(/^...-...-...$/))

    if (codes.length != 1) return `The command \`${commandName}\` requires one level code. Use the command as follows: \`${usage}\``

    const code = codes[0].replaceAll("-", "").toUpperCase()

    let thwompLevel = await ThwompEntry.findOne({"course.id": code}).populate("thwomp.uploaders course.uploader")

    if (!thwompLevel) return `There is no level by that code in THWOMP.`

    const levelEmbed = await thwomp_level_embed(thwompLevel)

    return levelEmbed

}

exports.run = thwomp_level_info
