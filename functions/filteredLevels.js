// get a list of levels meeting search criteria in parameters

// requires
const { mm2Genres } = require("../constants/genres")
const { gtc } = require("../constants/thwomp_genre_code")
const tgr = require("../functions/tgrAPI")
const CourseUploader = require("../models/CourseUploader")
const ThwompEntry = require("../models/ThwompEntry")
const ThwompUploader = require("../models/ThwompUploader")

async function thwomp_filtered_level_list(parameters) {

    // we're going to remove all the things we need from this. If there are still terms left one is invalid
    let searchTerms = parameters

    // get all of the codes out of the arguments and remove them from the search terms
    let codes = []
    searchTerms = searchTerms.filter(term => {
        term = term.replace(/^(?:code|maker|level):/, "")
        if (term.match(/^...-...-...$/)) {
            codes.push(term.toUpperCase())
            return false
        } else {
            return true
        }
    })

    // get all of the difficulties
    const allDifficulties = ["easy", "normal", "expert", "superexpert"]
    let difficulties = []
    searchTerms = searchTerms.filter(term => {
        term = term.replace(/^difficulty:/, "")
        if (allDifficulties.includes(term)) {
            difficulties.push(term)
            return false
        } else {
            return true
        }
    })
    
    // get all genres (including thwomp genres)
    const genres = []
    const allGenres = mm2Genres.concat(Object.keys(gtc))
    searchTerms = searchTerms.filter(term => {
        term = term.replace(/^genre:/, "")
        if (allGenres.includes(term)) {
            genres.push(term)
            return false
        } else {
            return true
        }
    })

    // get all curators
    let possibleCurators = []
    searchTerms.forEach(term => {
        term = term.replace(/^curator:/, "")
        possibleCurators.push(term)
    })

    // if (searchTerms.length != 0) {
    //     return `One or more of the parameters you have entered is invalid.`
    // }

    // remove all duplicates
    codes = codes.filter((code, i, arr) => arr.indexOf(code) == i)
    difficulties = difficulties.filter((code, i, arr) => arr.indexOf(code) == i)
    possibleCurators = possibleCurators.filter((code, i, arr) => arr.indexOf(code) == i)

    // separate codes into maker and level codes (verify they exist as well)
    let levelCodes = []
    let makerCodes = []
    for (let code of codes) {
        let levelJSON = await tgr.levelSearch(code)
        if (!levelJSON?.error) {
            levelCodes.push(code)
        } else if (levelJSON.error == "Code corresponds to a maker") {
            makerCodes.push(code)
        } else {
            return `The code \`${code}\` does not correspond to a maker or level.`
        }
    }

    // remove dashes from codes
    levelCodes = levelCodes.map(code => code.replaceAll("-", ""))
    makerCodes = makerCodes.map(code => code.replaceAll("-", ""))

    // find levels with makers codes listed
    const makersExist = await CourseUploader.find({ id: { $in: makerCodes } })
    const makerObjectIds = makersExist.map(maker => maker._id)
    
    // verify curators' existences
    const curatorsRegex = possibleCurators.map(curator => new RegExp(`^${curator}$`, "i"))
    const curatorsExist = await ThwompUploader.find({ $or: [{ name: { $in: curatorsRegex } }, { id: { $in: curators } }] })
    const curatorObjectIds = curatorsExist.map(curator => curator._id)

    // get all of the categories that have parameters
    let thwompEntryParameters = {}
    // TODO add genres here
    if (levelCodes.length != 0) thwompEntryParameters["course.id"] = { $in: levelCodes }
    if (makerCodes.length != 0) thwompEntryParameters["course.uploader"] = { $in: makerObjectIds }
    if (difficulties.length != 0) thwompEntryParameters["course.difficulty"] = { $in: difficulties }
    if (possibleCurators.length != 0) thwompEntryParameters["thwomp.uploaders"] = { $in: curatorObjectIds }

    // find al levels in each category that has a parameter
    const levelsSearched = await ThwompEntry.find(thwompEntryParameters).limit(10)

    return levelsSearched

}

exports.get_filtered_levels = thwomp_filtered_level_list