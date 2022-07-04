// updates a level in thwomp to its current information

// requires
const tgr = require("../functions/tgrAPI")
const CourseUploader = require("../models/CourseUploader")
const ThwompEntry = require("../models/ThwompEntry")
const { getThwompGenreCode } = require("../constants/thwomp_genre_code")
const ThwompUploader = require("../models/ThwompUploader")

async function thwomp_level_update(parameters, commandName, message) {

    // we also need to include genre updates

    const usage = `Your command is invalid. Use the command in one of the following ways:\n\`${commandName} XXX-XXX-XXX\` to update a level's info or a maker name.\n\`${commandName} XXX-XXX-XXX genre\` to update the THWOMP genre on a level.\n\`${commandName} OLD-LEV-EL0 NEW-LEV-EL0\` to update a level's code\n\`${commandName} curator:DISCORD_USER_ID\` to update a curator username.`

    // we're going to remove all the things we need from this. If there are still terms left one is invalid
    let searchTerms = parameters

    // get all of the codes out of the arguments and remove them from the search terms
    let codes = []
    searchTerms = searchTerms.filter(term => {
        if (term.match(/^...-...-...$/)) {
            codes.push(term.toUpperCase())
            return false
        } else {
            return true
        }
    })

    // get all curators
    let curators = []
    searchTerms = searchTerms.filter(term => {
        if (term.match(/^curator:/)) {
            curators.push(term.replace(/^curator:/, ""))
            return false
        } else {
            return true
        }
    })

    // get genres
    let genres = []
    searchTerms = searchTerms.filter(term => {
        if (getThwompGenreCode(term)) {
            genres.push(getThwompGenreCode(term))
            return false
        } else {
            return true
        }
    })

    if (searchTerms.length != 0) {
        return `One or more of the parameters you have entered is invalid.`
    }

    // delete repeats
    codes = codes.filter((code, i, arr) => arr.indexOf(code) == i)
    curators = curators.filter((code, i, arr) => arr.indexOf(code) == i)
    genres = genres.filter((code, i, arr) => arr.indexOf(code) == i)

    // separate codes into maker and level codes (verify they exist as well)
    let levelJSONs = []
    let makerJSONs = []
    for (let code of codes) {
        let jason = await tgr.levelSearch(code)
        if (!jason?.error) {
            levelJSONs.push(jason)
        } else if (jason.error == "Code corresponds to a maker") {
            jason = await tgr.makerSearch(code)
            makerJSONs.push(jason)
        } else {
            return `The code \`${code}\` does not correspond to a maker or level.`
        }
    }

    // length of each for command type
    const lengthOfEach = "l" + levelJSONs.length + "u" + makerJSONs.length + "m" + curators.length + "g" + (genres.length > 0 ? 1 : 0)

    let entry
    let levelJSON
    switch (lengthOfEach) {
        case "l1u0m0g1":
            // change level genre
            levelJSON = levelJSONs[0]
            entry = await ThwompEntry.findOne({ "course.id": levelJSON.course_id })
            if (!entry) return `There is no level by \`${levelJSON.course_id}\` in THWOMP.`
            entry.thwomp.genres = genres
            entry.thwomp.modified = Date.now()
            await entry.save()
            return `Successfully changed the genre of the level \`${entry.course.name}\``
        case "l1u0m0g0":
            // update level info
            levelJSON = levelJSONs[0]
            entry = await ThwompEntry.findOne({ "course.id": levelJSON.course_id })
            if (!entry) return `There is no level by \`${levelJSON.course_id}\` in THWOMP.`
            entry.course.genres = levelJSON.tags_name
            entry.course.difficulty = levelJSON.difficulty_name.replaceAll(" ", "").toLowerCase()
            entry.thwomp.midified = Date.now()
            await entry.save()
            return `Successfully updated \`${entry.course.name}\``
        case "l2u0m0g0":
            // change level code/update level info
            const oldLevelJSON = levelJSONs[0]
            const newLevelJSON = levelJSONs[1]
            const levelExists = await ThwompEntry.findOne({ "course.id": newLevelJSON.course_id })
            if (levelExists) return `The replacement code you entered already exists in THWOMP.`
            entry = await ThwompEntry.findOne({ "course.id": oldLevelJSON.course_id })
            if (!entry) return `There is no level by \`${levelJSON.course_id}\` in THWOMP.`
            const courseUploader = await CourseUploader.findOne({ id: newLevelJSON.uploader.code }) || new CourseUploader({
                name: newLevelJSON.uploader.name,
                id: newLevelJSON.uploader.code
            })
            await courseUploader.save()
            entry.course = {
                name: newLevelJSON.name,
                id: newLevelJSON.course_id,
                genres: newLevelJSON.tags_name,
                difficulty: newLevelJSON.difficulty_name.replaceAll(" ", "").toLowerCase(),
                uploaded: newLevelJSON.uploaded * 1000,
                uploader: courseUploader._id
            }
            entry.thwomp.midified = Date.now()
            await entry.save()
            return `Successfully update the level code`
        case "l0u1m0g0":
            // update uploader name
            const makerJSON = makerJSONs[0]
            entry = await CourseUploader.findOne({ id: makerJSON.code })
            if (!entry) return `No user by that code has a level in THWOMP.`
            entry.name = makerJSON.name
            await entry.save()
            return `The maker has been updated to ${entry.name}`
        case "l0u0m1g0":
            // update mod username
            const curatorId = curators[0]
            let discordUser = await message.guild.members.cache.get(curatorId)
            if (!discordUser) return `No user by that ID is in this server.`
            const thwompCurator = await ThwompUploader.findOne({ id: curatorId })
            if (!thwompCurator) return `No user by that ID is in THWOMP`
            thwompCurator.name = discordUser.user.username
            await thwompCurator.save()
            return `Successfully updated the user's name to \`${thwompCurator.name}\``
        default:
            return usage
    }

}

exports.run = thwomp_level_update