const env = require("dotenv")
env.config()

const { BOT_TOKEN, PREFIX, GUILD_ID, CURATOR_ID, MODERATOR_ID, NOTIFICATION_CHANNEL, MONGOURI } = process.env

config = {
    BOT_TOKEN,
    PREFIX,
    GUILD_ID,
    CURATOR_ID,
    MODERATOR_ID,
    NOTIFICATION_CHANNEL,
    MONGOURI
}

exports.config = config