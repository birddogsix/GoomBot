// send level info for the most recent level

// requires
const { level_embed } = require("../functions/level_info_embed")
const { newSearch } = require("../functions/tgrAPI")

async function new_level_info(parameters, commandName, message) {

    const usage = commandName

    if (parameters.length > 0) return `This command does not need any parameters. Please use it as follows: \`${usage}\``

    const levelJSON = await newSearch()
    if (levelJSON.error) return levelJSON.error
    const sendInfo = await level_embed(levelJSON)

    return sendInfo

}

exports.run = new_level_info