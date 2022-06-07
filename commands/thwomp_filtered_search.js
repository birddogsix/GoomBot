// get a list of all levels with the given parameters

// requires
const thwomp = require("../functions/filteredLevels")

async function thwomp_filtered_search(parameters, commandName, message) {

    const levels = await thwomp.get_filtered_levels(parameters)

    if (typeof levels == "string") return levels

    const levelsFormatted = levels.map(level => level.course.id.replace(/(...)(...)(...)/, "$1-$2-$3: `") + level.course.name + "`").join("\n")

    return `${levels.length + (levels.length >= 10 ? " or more" : "")} level${levels.length == 1 ? "" : "s"} meet${levels.length != 1 ? "" : "s"} that criteria.\n${levelsFormatted}${levels.length >= 10 ? "\nIf your search had more than 10 entries it was shortened to 10." : ""}`

}

exports.run = thwomp_filtered_search