// get a list of levels meeting search criteria in parameters

// requires
const { gtf } = require("./genres")
const { getThwompGenreCode } = require("./thwomp_genre_code")
const CourseUploader = require("../models/CourseUploader")
const ThwompUploader = require("../models/ThwompUploader")
const ThwompEntry = require("../models/ThwompEntry")
const { isMakerCode } = require("./dataIdInfo")

async function thwomp_filtered_levels_list(parameters, limit = Infinity) {

    let unusedArgs = removeDupes([...parameters])

    // what we are using to search in mongoose
    let searchParameters = {
        difficulties: [],
        levels: [],
        makers: [],
        curators: [],
        genres: [],
    }

    //functions we use to get the information from the unused arguments. Make sure these have the same keys as searchParameters
    let extractFunctions = {
        difficulties: (term) => term.match(/^(?:difficulty:)?(easy|normal|(?:super ?)?expert)$/)?.[1]?.replace("superexpert", "super expert"),
        levels: (term) => {
            const extractedArr = term.match(/^(level:|(?:code:)?)(...-...-...)$/)
            const extractedTerm = formatCode(extractedArr?.[2])
            if (!extractedTerm) return
            if (extractedArr[1] == "level:" || !isMakerCode(extractedTerm)) {
                return extractedTerm
            }
        },
        makers: (term) => {
            const extractedArr = term.match(/^(maker:|(?:code:)?)(.*)$/)
            const extractedTerm = extractedArr?.[2]
            if (!extractedTerm) return
            if (extractedArr[1] == "maker:" || isMakerCode(extractedTerm)) {
                if (extractedTerm.match(/^...-...-...$/)) {
                    return new RegExp(`^${extractedTerm.replace(/-/g, "-?")}$`, "i")
                } else {
                    return new RegExp(`^${extractedTerm}$`, "i")
                }
            }
        },
        curators: (term) => {
            const extractedTerm = term.match(/^curator:(.*)$/)?.[1]
            if (!extractedTerm) return
            return new RegExp(`^${extractedTerm}$`, "i")
        },
        genres: (term) => {
            const extractedTerm = term.match(/^(?:genre:)?(.*)$/)?.[1]
            return extractedTerm == "themed" ? ["th", "themed"] : gtf?.[extractedTerm] ?? getThwompGenreCode(extractedTerm)
        },
    }

    // get all search parameters
    Object.keys(searchParameters).forEach(key => {
        // find parameters
        unusedArgs = getTerms(unusedArgs, searchParameters[key], extractFunctions[key])
        // remove duplicates
        searchParameters[key] = removeDupes(searchParameters[key])
    })

    // some of the arguments weren't used. Send a message
    if (unusedArgs.length > 0) {
        const formattedUnusedArgs = "\`" + (unusedArgs.length == 1 ? unusedArgs.toString() : unusedArgs.length == 2 ? unusedArgs.join("\` and \`") : unusedArgs.slice(0, -1).join("\`, \`") + "\`, and \`" + unusedArgs.slice(-1)) + "\`"
        return `The search parameter${unusedArgs.length == 1 ? "" : "s"} ${formattedUnusedArgs} ${unusedArgs.length == 1 ? "is" : "are"} not valid. Double check your inputs and try again.`
    }

    // convert curators to _id's and send missing errors
    const newCurators = (await Promise.all(
        searchParameters.curators.map(curator => ThwompUploader.findOne({ "$or": [{ "name": curator }, { "id": curator }] }))
    )).filter(curator => curator)
    const missedCurators = searchParameters.curators.filter(curator => !newCurators.some(newCurator => newCurator.name.match(curator))).map(missed => missed.toString().replace(/^\/\^|\$\/i$/g, ""))
    if (missedCurators.length > 0) {
        const formattedMissedCurators = "\`" + (missedCurators.length == 1 ? missedCurators.toString() : missedCurators.length == 2 ? missedCurators.join("\` and \`") : missedCurators.slice(0, -1).join("\`, \`") + "\`, and \`" + missedCurators.slice(-1)) + "\`"
        return `The curator${missedCurators.length == 1 ? "" : "s"} ${formattedMissedCurators} ${missedCurators.length == 1 ? "was" : "were"} not found in THWOMP. Please try again with an updated curator list.`
    }
    searchParameters.curators = newCurators.map(curator => curator._id)

    // convert course uploaders to _id's and send missing errors
    const newMakers = (await Promise.all(
        searchParameters.makers.map(maker => CourseUploader.findOne({ "$or": [{ "name": maker }, { "id": maker }] }))
    )).filter(maker => maker)
    const missedMakers = searchParameters.makers.filter(maker => !newMakers.some(newMaker => newMaker.name.match(maker) || newMaker.id.match(maker))).map(missed => missed.toString().replace(/^\/\^|\$\/i$/g, "").replace(/-\?/g, "-"))
    if (missedMakers.length > 0) {
        const formattedMissedMakers = "\`" + (missedMakers.length == 1 ? missedMakers.toString() : missedMakers.length == 2 ? missedMakers.join("\` and \`") : missedMakers.slice(0, -1).join("\`, \`") + "\`, and \`" + missedMakers.slice(-1)) + "\`"
        return `The maker${missedMakers.length == 1 ? "" : "s"} ${formattedMissedMakers} ${missedMakers.length == 1 ? "was" : "were"} not found in THWOMP. Please try again with an updated maker list.`
    }
    searchParameters.makers = newMakers.map(maker => maker._id)

    // create search object
    const searchPaths = {
        difficulties: ["course.difficulty"],
        levels: ["course.id"],
        makers: ["course.uploader"],
        curators: ["thwomp.uploaders"],
        genres: ["course.genres", "thwomp.genres"],
    }
    const keyParameters = Object.keys(searchParameters).map(key => {
        if (searchParameters[key].length > 0) return `{"$or":[${searchPaths[key].map(path => `{"${path}":{"$in":${JSON.stringify(searchParameters[key])}}}`)}]}`
    }).filter(param => param).join(",")
    const databaseParameters = keyParameters ? JSON.parse(`{"$and":[${keyParameters}]}`) : {}

    const foundLevelEntries = ThwompEntry.find(databaseParameters).limit(limit)

    return foundLevelEntries
}

// other functions used in the main one
const removeDupes = (arr) => arr.filter((e, i, a) => a.indexOf(e) == i)
const formatCode = (code) => code?.replace(/-/g, "")?.toUpperCase()
const getTerms = (unusedArgs, addArr, extractFunction) => {
    return unusedArgs.filter(term => {
        let match = extractFunction(term)
        if (match) addArr.push(...[match].flat())
        return !match
    }).filter(diff => diff)
}

exports.get_filtered_levels = thwomp_filtered_levels_list