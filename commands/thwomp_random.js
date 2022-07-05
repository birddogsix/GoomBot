// get a a random level from thwomp with the specified parameters

// requires
const thwomp = require("../exports/filteredLevels")
const { thwomp_level_embed } = require("../exports/thwomp_level_info_embed")

async function thwomp_random_level_info(parameters, commandName, message) {

    const levels = await thwomp.get_filtered_levels(parameters)

    if (typeof levels == "string") return levels

    let chosenLevel = await levels[Math.floor(Math.random() * levels.length)].populate("thwomp.uploaders course.uploader")

    const levelEmbed = await thwomp_level_embed(chosenLevel)

    return levelEmbed

}

exports.run = thwomp_random_level_info