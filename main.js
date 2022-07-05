// discord bot for the MM2 Puzzle Community Discord

// Setup
const { Client, Intents, MessageEmbed, Message, MessageAttachment } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'USER'] })

// import the needed bot variables
const { config } = require("./exports/bot_variables")

// fs and fetch setup
const fs = require("fs")
const fetch = require("node-fetch")

// mongoose models and setup
const mg = require("mongoose")
mg.connect(config.MONGOURI)

const { replacements, combineTerms } = require("./exports/replaceTerms")

// import all of the commands
const commands = [
    {
        names: ["tadd", "thwompadd"],
        command: require("./commands/thwomp_add"),
        clearances: [config.CURATOR_ID]
    },
    {
        names: ["tremove", "thwompremove"],
        command: require("./commands/thwomp_remove"),
        clearances: [config.CURATOR_ID]
    },
    {
        names: ["tupdate", "thwompupdate"],
        command: require("./commands/thwomp_update"),
        clearances: [config.CURATOR_ID]
    },
    {
        names: ["tclean", "thwompclean"],
        command: require("./commands/thwomp_clean_unused"),
        clearances: [config.CURATOR_ID]
    },
    {
        names: ["tcheck", "thwompcheck"],
        command: require("./commands/thwomp_check"),
        clearances: [config.CURATOR_ID]
    },
    {
        names: ["tsearch", "thwompsearch"],
        command: require("./commands/thwomp_filtered_search")
    },
    {
        names: ["trandom", "thwomprandom"],
        command: require("./commands/thwomp_random")
    },
    {
        names: ["tinfo", "thwompinfo"],
        command: require("./commands/thwomp_level_info")
    },
    {
        names: ["help", "thelp", "thwomphelp"],
        command: require("./commands/help")
    },
    {
        names: ["tstats", "thwompstats"],
        command: require("./commands/thwomp_stats")
    },
    {
        names: ["info"],
        command: require("./commands/info")
    },
    {
        names: ["random"],
        command: require("./commands/random")
    },
    {
        names: ["new"],
        command: require("./commands/new")
    },
]

// bot is online message
client.once("ready", () => {
    console.log("Logged in as", client.user.tag)

})

// on someone sending a message
client.on("messageCreate", async (message) => {

    // don't respond to bots. Lowers the chance of infinite loops
    if (message.author.bot) return

    // check if it is a command for the bot
    if (!message.content.match(new RegExp(`^${config.PREFIX}`))) return

    // prepare arguments (remove prefix, lower case everything, only split elements not in combineTerms or not surrounded by quotes, replace multiple white spaces with just one)
    let args = message.content.replace(`${config.PREFIX}`, "").toLowerCase()
    args = combineTerms(args)
    args = args.split(/\s+(?=(?:[^\s]*:)?".*")|(?<=".*")\s+/g) // checks for spaces that surround "" or filter:""
    args = args.map(arg => {
        if (!arg.match(/^(?:.*:)?".*"$/)) { // if it is not surrounded by "" or filter:""
            arg = arg.split(/\s+/) // split by spaces
        } else {
            arg = arg.replace(/(?<=^[^\s]*:|^)"|"$/g, "") // remove quotes
        }
        return arg
    })
    args = args.flat() // flatten nested arrays from the secondary split

    // run commands
    const currentCommand = commands.find(command => command.names.includes(args[0]))
    if (currentCommand) {

        // letting the person know we are working on it with a reaction
        await message.react("🔄").catch(err => console.error(err))

        // remove first argument (the command)
        args.shift()

        //run command (check clearance first to see if they have the correct role to run the command)
        let answer
        //const commandIssuer = await message.guild.members.fetch(message.author.id)
        const mainGuild = await client.guilds.fetch(config.GUILD_ID)
        const commandIssuer = await mainGuild.members.fetch(message.author.id)
        if (!currentCommand?.clearances || commandIssuer._roles.find(role => currentCommand.clearances.includes(role))) {
            answer = await currentCommand.command.run(args, config.PREFIX + currentCommand.names[0], message, config).catch(err => console.log(err))
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
        clearances: [config.MODERATOR_ID]
    },
]

// on member updating information
client.on("guildMemberUpdate", async (oldMember, newMember) => {

    // run through all commands in this category
    gmuCommands.forEach(current => {
        current.command.run(oldMember, newMember, current.clearances, config).catch(err => console.log(err))
    })

})

// bot token login
client.login(config.BOT_TOKEN)