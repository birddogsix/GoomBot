// check if any level codes are outdated

//requires
const { levelSearch } = require("../functions/tgrAPI")
const ThwompEntry = require("../models/ThwompEntry")

async function thwomp_check_invalid(parameters, commandName, message) {

    message.reply("This could take a while. Please wait.").catch(err => console.log(err))

    const entries = await ThwompEntry.find({}).populate("course.uploader")

    let invalidCodes = []
    for (let entry of entries) {
        const levelJSON = await levelSearch(entry.course.id)
        if (levelJSON.error == "Invalid course ID") invalidCodes.push(entry.course.id)
    }
    const invalidEntries = entries.filter(entry => invalidCodes.includes(entry.course.id))
    // const invalidEntries = entries.filter(entry => Math.random() > 0.5) // for faster testing

    const sendEntries = invalidEntries.map(entry =>
        `\`${entry.course.name} (${entry.course.id.replace(/(...)(...)(...)/, "$1-$2-$3")})\` by \`${entry.course.uploader.name} (${entry.course.uploader.id.replace(/(...)(...)(...)/, "$1-$2-$3")})\``
    )

    return "Invalid levels:\n" + (sendEntries.length > 0 ? sendEntries.join("\n") : "None")

}

exports.run = thwomp_check_invalid