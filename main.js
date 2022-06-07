// discord bot for the MM2 Puzzle Community Discord

// Setup
const { Client, Intents, MessageEmbed, Message, MessageAttachment } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], partials: ['CHANNEL', 'USER'] })

// fs and fetch setup
const fs = require("fs")
const fetch = require("node-fetch")

// for environment variables
const env = require("dotenv")
env.config()

// mongoose models and setup
const mg = require("mongoose")
const ThwompLevel = require("./models/ThwompEntry")
mg.connect(process.env.MONGOURI)

// ids from discord
const thwompUploaderId = "971883166375755786"
const modId = "971883166375755786"

// import all of the commands
const commands = [
    {
        name: "tadd",
        command: require("./commands/thwomp_add"),
        clearances: [thwompUploaderId]
    },
    {
        name: "tremove",
        command: require("./commands/thwomp_remove"),
        clearances: [thwompUploaderId]
    },
    {
        name: "tupdate",
        command: require("./commands/thwomp_update"),
        clearances: [thwompUploaderId]
    },
    {
        name: "tclean",
        command: require("./commands/thwomp_clean_unused"),
        clearances: [thwompUploaderId]
    },
    {
        name: "tsearch",
        command: require("./commands/thwomp_filtered_search")
    },
    {
        name: "trandom",
        command: require("./commands/thwomp_random")
    },
    {
        name: "tinfo",
        command: require("./commands/thwomp_level_info")
    },
    {
        name: "help",
        command: require("./commands/help")
    },
    {
        name: "tstats",
        command: require("./commands/thwomp_stats")
    },
    {
        name: "info",
        command: require("./commands/info")
    }
]

// other constants to be used in main
const prefix = "t!" // what you start a message with in order for the bot to check the message for commands
const combineTerms = ["short and sweet", "puzzle solving", "multiplayer vs", "multiplayer versus", "boss battle", "single player", "one screen puzzle", "one screen", "escape the mansion", "escape room", "super expert", "one-screen puzzle", "escape the mansion puzzle", "escape room puzzle", "themed puzzle"] // what to combine so it does not get split up in the command arguments

// bot is online message
client.once("ready", () => {
    console.log("test my puzzle level")
})

// on someone sending a message
client.on("messageCreate", async (message) => {

    // don't respond to bots. Lowers the chance of infinite loops
    if (message.author.bot) return

    // check if it is a command for the bot
    if (!message.content.match(new RegExp(`^${prefix}`))) return

    // prepare arguments (lower case everything and replace extra spaces, combine terms, split, remove first g! from command)
    let args = message.content.replace(`${prefix}`, "").replaceAll(/\n/g, " ").replaceAll(/ {2,}/g, " ").toLowerCase()
    combineTerms.forEach(term => {
        args = args.replaceAll(new RegExp(`${term}`, "g"), term.replaceAll(" ", ""))
    })
    args = args.split(" ")

    // run commands
    const currentCommand = commands.find(command => command.name == args[0])
    if (currentCommand) {

        // letting the person know we are working on it with a reaction
        if (message.channel.type != "DM") message.react("🔄").catch(err => console.error(err))

        // remove first argument (the command)
        args.shift()

        //run command (check clearance first to see if they have the correct role to run the command)
        let answer
        const commandIssuer = await message.guild.members.fetch(message.author.id)
        if (!currentCommand?.clearances || commandIssuer._roles.find(role => currentCommand.clearances.includes(role))) {
            answer = await currentCommand.command.run(args, prefix + currentCommand.name, message).catch(err => console.log(err))
        } else {
            answer = "You do not have permission to use that command."
        }

        // send command response
        if (typeof answer == "string") {
            message.reply(answer).catch(err => console.error(err))
        } else if (answer?.text) {
            message.reply(answer.text, { embeds: [answer.embed], files: [answer.attachment] }).catch(err => console.error(err))
        } else if (answer) {
            message.reply({ embeds: [answer.embed], files: [answer.attachment] }).catch(err => console.error(err))
        } else {
            message.reply("Something went wrong").catch(err => console.log(err))
        }

    }

    // remove reaction because command is over
    if (message.channel.type != "DM") message.reactions.removeAll().catch(err => console.error(err))

})

const gmuCommands = [
    {
        command: require("./commands/force_medal_amounts"),
        clearances: [modId]
    },
]

// on member updating information (and joining i think ??)
client.on("guildMemberUpdate", async (oldMember, newMember) => {

    // run through all commands in this category
    gmuCommands.forEach(current => {
        current.command.run(oldMember, newMember, current.clearances).catch(err => console.log(err))
    })

})

// bot token login
client.login(process.env.BOT_TOKEN)