// get stats for thwomp levels

// requires
const { ctg } = require("../exports/thwomp_genre_code")
const { createPieGraph } = require("../exports/createGraph")
const ThwompEntry = require("../models/ThwompEntry")
const CourseUploader = require("../models/CourseUploader")

async function thwomp_stats(parameters, commandName) {

    // send general stats if no parameters
    if (parameters.length == 0) {
        const numOfLevels = await ThwompEntry.count({})
        const numOfMakers = await CourseUploader.count({})
        const { version } = require('../package.json')
        const { MessageEmbed} = require("discord.js")
        const levelEmbed = new MessageEmbed()
            .setTitle("THWOMP Overview")
            .setDescription("Version " + version)
            .addFields(
                { name: "<:thwomp:984509792523522088> THWOMP Levels", value: String(numOfLevels), inline: true },
                { name: "<:thwomp:984509792523522088> THWOMP Makers", value: String(numOfMakers), inline: true },
                
            )
            .setTimestamp()
        return { embed: levelEmbed }
    }

    const usage = commandName + " tag"

    if (parameters.length > 1) return `This command only requires at most one parameter. Please use the command as follows (tags: \`curators\`, \`makers\`, \`difficulties\`, \`tags\`, and \`puzzle tags\`): \`${usage}\``

    // tag to path, array means the data is in an array and the first index is the extra path after getting in the array
    const ttp = {
        curators: ["thwomp.uploaders", "name"],
        curator: ["thwomp.uploaders", "name"],
        makers: "course.uploader.name",
        maker: "course.uploader.name",
        difficulties: "course.difficulty",
        difficulty: "course.difficulty",
        genres: ["course.genres"],
        genre: ["course.genres"],
        tag: ["course.genres"],
        tags: ["course.genres"],
        puzzlegenres: ["thwomp.genres"],
        puzzlegenre: ["thwomp.genres"],
        "puzzle genres": ["thwomp.genres"],
        "puzzle genre": ["thwomp.genres"],
        puzzletag: ["thwomp.genres"],
        puzzletags: ["thwomp.genres"],
        "puzzle tags": ["thwomp.genres"],
        "puzzle tag": ["thwomp.genres"],
    }

    const dataPath = ttp?.[parameters[0]]
    if (!dataPath) return `The tag you have entered is invalid. Please use one of the following tags: \`curators\`, \`makers\`, \`difficulties\`, \`tags\`, or \`puzzle tags\`.`

    const entries = await ThwompEntry.find({}).populate("course.uploader thwomp.uploaders")
    const dataset = {}
    if (typeof dataPath == "string") {
        entries.forEach(entry => {
            const dataValue = getNestedObject(entry, dataPath)
            if (dataset?.[dataValue]) {
                dataset[dataValue]++
            } else {
                dataset[dataValue] = 1
            }
        })
    } else {
        entries.forEach(entry => {
            const dataArr = getNestedObject(entry, dataPath[0])
            dataArr.forEach(dataPoint => {
                const dataValue = getNestedObject(dataPoint, dataPath?.[1])
                if (dataset?.[dataValue]) {
                    dataset[dataValue]++
                } else {
                    dataset[dataValue] = 1
                }
            })
        })
    }

    // remove Puzzle solving from genres
    let note
    if (dataset?.["Puzzle solving"]) {
        note = "Puzzle solving was not included."
        delete dataset["Puzzle solving"]
    }

    // convert th, er, em, os to names
    if (dataPath?.[0] == ttp.puzzlegenres[0]) {
        Object.keys(dataset).forEach(key => {
            const newKey = ctg[key]
            dataset[newKey] = dataset[key]
            delete dataset[key]
        })
    }

    // create "other" tag
    let smallestPortion = 0 // 0 is the max value for a portion
    let otherPortion = 0.05
    const dataSize = Object.values(dataset).reduce((a, b) => a + b)
    Object.keys(dataset).forEach(key => {
        const portion = dataset[key] / dataSize
        if (portion < otherPortion && portion > smallestPortion) {
            smallestPortion = portion
        }
    })
    if (smallestPortion != 0) {
        dataset.Other = 0
        Object.keys(dataset).forEach(key => {
            if (dataset[key] <= smallestPortion * dataSize) {
                dataset.Other += dataset[key]
                delete dataset[key]
            }
        })
    }

    const attachment = await createPieGraph(dataset, note)

    return { attachment }

}

function getNestedObject(obj, path) {
    if (!path) return obj
    let obj2 = obj
    path.split(".").forEach(el => {
        obj2 = obj2[el]
    })
    return obj2
}

exports.run = thwomp_stats