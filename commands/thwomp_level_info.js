// display information on a single level code you submitted in THWOMP

const { thwomp_level_embed } = require("../functions/thwomp_level_info_embed")
const ThwompEntry = require("../models/ThwompEntry")

// requires

async function thwomp_level_info(parameters, commandName, message, botVars) {

    const usage = `${commandName} LEV-ELC-ODE`

    const codes = parameters.filter(param => param.match(/^...-...-...$/))

    if (codes.length != 1) return `The command \`${commandName}\` requires one level code. Use the command as follows: \`${usage}\``

    const code = codes[0].replaceAll("-", "").toUpperCase()

    let thwompLevel = await ThwompEntry.findOne({ "course.id": code }).populate("thwomp.uploaders course.uploader")

    if (!thwompLevel) return `There is no level by that code in THWOMP.`

    const levelEmbed = await thwomp_level_embed(thwompLevel)

    if (levelEmbed == "Invalid course ID") {
        const notifChannel = await message.guild.channels.cache.get(botVars.notificationChannel)
        notifChannel
            .send(`The code \`${thwompLevel.course.id.replace(/(...)(...)(...)/g, "$1-$2-$3")}\` no longer works. The level was called \`${thwompLevel.course.name}\` and it was uploaded by \`${thwompLevel.course.uploader.name}\` with the maker code \`${thwompLevel.course.uploader.id.replace(/(...)(...)(...)/g, "$1-$2-$3")}\`.`)
            .catch(err => console.log(err))
        return "The level code no longer works. It may have been deleted."
    }

    return levelEmbed

}

exports.run = thwomp_level_info
