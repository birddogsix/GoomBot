// get a list of all levels with the given parameters

// requires
const thwomp = require("../functions/filteredLevels")

async function thwomp_filtered_search(parameters, commandName, message) {

    const maxLimit = 10
    const limitsParsed = parameters.filter(parameter => parameter.match(/^limit:/)).map(el => el?.replace(/^limit:/, ""))
    if (limitsParsed.length > 1) return `You have entered too many limits.`
    const limitParsed = limitsParsed?.[0] ?? maxLimit
    if (limitParsed == "") return `You have entered a limit filter without entering a limit. Try \`${commandName} limit:#\``
    if (isNaN(limitParsed)) return `The limit \`${limitParsed}\` is not a number.`
    let limit = parseInt(limitParsed)
    parameters = parameters.filter(parameter => !parameter.match(/^limit:/))
    if (typeof limit != "number" || Math.floor(limit) != limit || limit < 1) return `The parameter \`limit\` must be an positive whole number`
    if (message.channel.type != "DM" && limit > maxLimit) limit = maxLimit

    const levels = await thwomp.get_filtered_levels(parameters, limit)

    let notice = ""
    if (levels.length == limit) notice = `\nYour search results may have been shortened to ${limit}. If you would like more results use a higher number for \`${commandName} limit:#\`${limit == maxLimit ? " in a direct message to this bot": ""}.`

    if (typeof levels == "string") return levels

    const levelsFormatted = levels.map(level => level.course.id.replace(/(...)(...)(...)/, "$1-$2-$3: `") + level.course.name + "`").join("\n")

    return `${levels.length + (levels.length >= limit ? " or more" : "")} level${levels.length == 1 ? "" : "s"} meet${levels.length != 1 ? "" : "s"} that criteria.\n${levelsFormatted}${notice}`

}

exports.run = thwomp_filtered_search