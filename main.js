// discord bot for the MM2 Puzzle Community Discord

// Setup
const { Client, Intents, MessageEmbed, Message, MessageAttachment } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'USER'] })

// import the needed bot variables
const { regular, testing } = require("./constants/bot_variables")
const GoomBotId = "969684811193135256"
let botVars = regular

// fs and fetch setup
const fs = require("fs")
const fetch = require("node-fetch")

// for environment variables
const env = require("dotenv")
env.config()

// mongoose models and setup
const mg = require("mongoose")
mg.connect(process.env.MONGOURI)

// import all of the commands
const commands = [
    {
        name: "tadd",
        command: require("./commands/thwomp_add"),
        clearances: [botVars.curatorId]
    },
    {
        name: "tremove",
        command: require("./commands/thwomp_remove"),
        clearances: [botVars.curatorId]
    },
    {
        name: "tupdate",
        command: require("./commands/thwomp_update"),
        clearances: [botVars.curatorId]
    },
    {
        name: "tclean",
        command: require("./commands/thwomp_clean_unused"),
        clearances: [botVars.curatorId]
    },
    {
        name: "tcheck",
        command: require("./commands/thwomp_check"),
        clearances: [botVars.curatorId]
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
    },
    {
        name: "random",
        command: require("./commands/random")
    },
    {
        name: "new",
        command: require("./commands/new")
    },
]

// other constants to be used in main
const combineTerms = ["puzzle genre", "puzzle genres", "short and sweet", "puzzle solving", "multiplayer vs", "multiplayer versus", "boss battle", "single player", "one screen puzzle", "one screen", "escape the mansion", "escape room", "super expert", "one-screen puzzle", "escape the mansion puzzle", "escape room puzzle", "themed puzzle"] // what to combine so it does not get split up in the command arguments

// bot is online message
client.once("ready", () => {
    console.log("Logged in as", client.user.tag)

    // set the bot variables to the correct version (testing or default)
    if (client.user.id != GoomBotId) {
        botVars = testing
    }

})

// on someone sending a message
client.on("messageCreate", async (message) => {

    // don't respond to bots. Lowers the chance of infinite loops
    if (message.author.bot) return

    // check if it is a command for the bot
    if (!message.content.match(new RegExp(`^${botVars.prefix}`))) return

    // prepare arguments (lower case everything and replace extra spaces, combine terms, split, remove first g! from command)
    let args = message.content.replace(`${botVars.prefix}`, "").replaceAll(/\n/g, " ").replaceAll(/ {2,}/g, " ").toLowerCase()
    combineTerms.forEach(term => {
        args = args.replaceAll(new RegExp(`${term}`, "g"), term.replaceAll(" ", ""))
    })
    args = args.split(" ")

    // run commands
    const currentCommand = commands.find(command => command.name == args[0])
    if (currentCommand) {

        // letting the person know we are working on it with a reaction
        await message.react("🔄").catch(err => console.error(err))

        // remove first argument (the command)
        args.shift()

        //run command (check clearance first to see if they have the correct role to run the command)
        let answer
        //const commandIssuer = await message.guild.members.fetch(message.author.id)
        const mainGuild = await client.guilds.fetch(botVars.guildId)
        const commandIssuer = await mainGuild.members.fetch(message.author.id)
        if (!currentCommand?.clearances || commandIssuer._roles.find(role => currentCommand.clearances.includes(role))) {
            answer = await currentCommand.command.run(args, botVars.prefix + currentCommand.name, message, botVars).catch(err => console.log(err))
        } else {
            answer = "You do not have permission to use that command."
        }

        // send command response
        if (typeof answer == "string") {
            message.reply(answer).catch(err => console.error(err))
        } else if (answer) {
            // create send arguments
            let sendArgs = [
                answer?.text,
                {
                    embeds: [answer?.embed],
                    files: [answer?.attachment]
                }
            ]
            // delete unused arguments
            if (!answer?.embed) delete sendArgs[1].embeds
            if (!answer?.attachment) delete sendArgs[1].files
            if (!answer?.text) sendArgs.shift()
            // send reply
            message.reply(...sendArgs).catch(err => console.log(err))
        } else {
            message.reply("Something went wrong").catch(err => console.log(err))
        }

    }

    // remove reaction because command is over
    await message.reactions.resolve("🔄")?.users.remove(client.user.id)

})

const gmuCommands = [
    {
        command: require("./commands/force_medal_amounts"),
        clearances: [botVars.modId]
    },
]

// on member updating information
client.on("guildMemberUpdate", async (oldMember, newMember) => {

    // run through all commands in this category
    gmuCommands.forEach(current => {
        current.command.run(oldMember, newMember, current.clearances, botVars).catch(err => console.log(err))
    })

})

// bot token login
client.login(process.env.BOT_TOKEN)