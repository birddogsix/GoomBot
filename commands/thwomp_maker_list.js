// get a list of 10 random makers in thwomp

// requires
const CourseUploader = require("../models/CourseUploader")

async function thwomp_maker_list(parameters, commandName, message) {

    const allMakers = await CourseUploader.find({})
    let sendMakers = []
    const maxMakers = 10

    if (allMakers.length > maxMakers) {
        while (sendMakers.length < maxMakers) {
            console.log("a")
            const addMaker = allMakers[Math.floor(Math.random() * allMakers.length)]
            const formattedMaker = addMaker.id.replace(/(...)(...)(...)/, "$1-$2-$3") + ": `" + addMaker.name + "`"
            if (!sendMakers.includes(formattedMaker)) sendMakers.push(formattedMaker)
        }
    } else {
        sendMakers = allMakers.map(maker => maker.id.replace(/(...)(...)(...)/, "$1-$2-$3") + ": `" + maker.name + "`")
    }

    return "Here is a list of some makers that have levels in THWOMP: \n" + sendMakers.join("\n")

}

exports.run = thwomp_maker_list