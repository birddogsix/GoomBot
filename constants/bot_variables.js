// variables for the main bot
const default_bot_variables = {
    prefix: "g!",
    guildId: "970383307500036137", // change these when we move to the main server
    curatorId: "971883166375755786",
    modId: "971883166375755786",
}

// variables for when we are testing on a different bot
const testing_bot_variables = {
    prefix: "t!",
    guildId: "970383307500036137",
    curatorId: "971883166375755786",
    modId: "971883166375755786",
}

exports.regular = default_bot_variables
exports.testing = testing_bot_variables