// remove a level from THWOMP data base

// requires
const tgr = require("../exports/tgrAPI")
const ThwompEntry = require("../models/ThwompEntry")
const CourseUploader = require("../models/CourseUploader")

async function thwomp_remove(parameters, commandName, message, botVars) {

    const usage = `${commandName} LEV-ELC-ODE`

    const codes = parameters.filter(param => param.match(/^...-...-...$/))
    if (codes.length != 1) {
        return `The command \`${commandName}\` requires one level code. Use the command as follows: \`${usage}\``
    }
    const code = codes[0].replaceAll("-", "").toUpperCase()

    // get the level from the data base
    const entry = await ThwompEntry.findOne({ "course.id": code })
    if (!entry) return `There is no level in THWOMP by that code.`

    // delete it
    await ThwompEntry.deleteOne({ "course.id": code })

    // see if the person who uploaded the level has anymore levels in thwomp and notify someone
    const stillHasLevels = await ThwompEntry.findOne({ "course.uploader": entry.course.uploader })
    if (!stillHasLevels) {
        // send notif and delete user from thwompuploaders
        const notifChannel = await message.guild.channels.cache.get(botVars.NOTIFICATION_CHANNEL)
        const uploader = await CourseUploader.findOne({ "_id": entry.course.uploader })
        await CourseUploader.deleteOne({ "_id": entry.course.uploader })
        notifChannel.send(`User \`${uploader.name}\` no longer has any levels in THWOMP`)
    }

    return `\`${entry.course.name}\` has been removed from THWOMP.`

}

exports.run = thwomp_remove