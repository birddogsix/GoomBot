// add a level to the THWOMP data base

// requires
const { getThwompGenreCode } = require("../exports/thwomp_genre_code")
const tgr = require("../exports/tgrAPI")
const ThwompEntry = require("../models/ThwompEntry")
const CourseUploader = require("../models/CourseUploader")
const ThwompUploader = require("../models/ThwompUploader")

// command function contents
async function thwomp_add(parameters, commandName, message, botVars) {

    const usage = `${commandName} LEV-ELC-ODE tag(s)`

    // check if the first parameter is a code
    const codes = parameters.filter(param => param.match(/...-...-.../))
    const genres = parameters.filter(param => getThwompGenreCode(param)).map(genre => getThwompGenreCode(genre)).filter((genre, i, arr) => arr.indexOf(genre) == i)

    // there are 0 or 2+ codes in the level
    if (codes.length != 1) {
        return `The command \`${commandName}\` requires one level code. Use the command as follows: \`${usage}\``
    }

    // there are no genres listed
    if (genres.length == 0) {
        return `The command \`${commandName}\` requires at least one tag (such as one screen puzzle, escape room, escape the mansion, etc). Use the command as follows: \`${usage}\``
    }

    const code = codes[0].replaceAll("-", "").toUpperCase()

    // get the level JSON
    let levelJSON = await tgr.levelSearch(code)

    // error from levelJSON
    if (levelJSON.error) return levelJSON.error

    // check if entry exist
    let existingLevel = await ThwompEntry.findOne({ "course.id": code })

    if (existingLevel) {

        let thwompUploader = await ThwompUploader.findOne({ id: message.author.id }) || new ThwompUploader({
            name: message.author.username,
            id: message.author.id
        })

        await thwompUploader.save()

        if (!existingLevel.thwomp.uploaders.includes(thwompUploader._id)) {
            existingLevel.thwomp.uploaders.push(thwompUploader._id)
            existingLevel.thwomp.modified = Date.now()
            await existingLevel.save()
        }

        return `\`${levelJSON.name}\` by \`${levelJSON.uploader.name}\` is already in THWOMP. You have been added as an uploader if you were not already one.`

    }

    // create entry
    let courseUploader = await CourseUploader.findOne({ id: levelJSON.uploader.code })
    if (!courseUploader) {
        courseUploader = new CourseUploader({
            name: levelJSON.uploader.name,
            id: levelJSON.uploader.code
        })
        const notifChannel = await message.guild.channels.cache.get(botVars.NOTIFICATION_CHANNEL)
        notifChannel.send(`\`${courseUploader.name}\` has had their first level added to THWOMP!`).catch(err => console.log(err))
    }
    await courseUploader.save()

    const thwompUploader = await ThwompUploader.findOne({ id: message.author.id }) || new ThwompUploader({
        name: message.author.username,
        id: message.author.id
    })
    await thwompUploader.save()

    const entry = new ThwompEntry({
        course: {
            name: levelJSON.name,
            id: levelJSON.course_id,
            genres: levelJSON.tags_name,
            difficulty: levelJSON.difficulty_name.replaceAll(" ", "").toLowerCase(),
            uploaded: levelJSON.uploaded * 1000,
            uploader: courseUploader._id
        },
        thwomp: {
            genres: genres,
            uploaded: Date.now(),
            uploaders: [thwompUploader._id]
        }
    })
    entry.save()

    return `\`${levelJSON.name}\` by \`${levelJSON.uploader.name}\` has been successfully added to THWOMP.`

}

exports.run = thwomp_add