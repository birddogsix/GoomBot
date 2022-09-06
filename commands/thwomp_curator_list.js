// get a list of  ALL of the curators

// requires
const ThwompUploader = require("../models/ThwompUploader")

async function thwomp_curator_list(parameters, commandName, message) {

    const curators = await ThwompUploader.find({})
    const formattedCurators = curators.map(curator => `\`${curator.names[0]}\`${curator.isStreamer ? `\`${curator.streamerInfo.link}\`` : ""}`)

    return "Here is a list of all the THWOMP curators!\n" + formattedCurators.join("\n")

}

exports.run = thwomp_curator_list