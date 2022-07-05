// gets a random level and sends info about it

// requires
const { level_embed } = require("../exports/level_info_embed")
const { endlessSearch } = require("../exports/tgrAPI")

async function random_level_info(parameters, commandName, message) {

    const usage = `${commandName} difficulty`

    // difficulty to code
    const dtc = {
        easy: "e",
        normal: "n",
        expert: "ex",
        superexpert: "sex",
        "super expert": "sex",
    }

    if (parameters.length > 1) return `This command can only take up to 1 parameter. Use the command as follows (difficulty is optional): \`${usage}\``

    let difficulty = ["e", "n", "ex", "sex"][Math.floor(Math.random() * 4)]
    if (parameters.length == 1) {
        if (dtc?.[parameters?.[0]]) {
            difficulty = dtc[parameters[0]]
        } else {
            return `The parameter you have entered is invalid. Please use \`easy\`, \`normal\`, \`expert\`, \`super expert\`, or nothing at all.`
        }
    }

    const levelJSON = await endlessSearch(difficulty)
    if (levelJSON.error) return levelJSON.error
    const sendInfo = await level_embed(levelJSON)

    return sendInfo

}

exports.run = random_level_info