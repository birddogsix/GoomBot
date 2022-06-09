// create an embed for a level

// requires
const { thumbnailSearch } = require("./tgrAPI")
const { MessageEmbed, MessageAttachment } = require("discord.js")
const { mii_studio_to_code } = require("./mii_studio_code_to_color")
const ThwompEntry = require("../models/ThwompEntry")

async function level_embed(levelJSON) {

    // get, convert, and save level thumbnail
    const thumbnail = await thumbnailSearch(levelJSON.course_id)
    const thumbnailBuffer = new Buffer.from(thumbnail)
    const attachment = new MessageAttachment(thumbnailBuffer, "thumbnail.jpg")

    // get information from api
    const favoriteColor = mii_studio_to_code(levelJSON.uploader.mii_studio_code)
    const miiThumbnail = levelJSON.uploader.mii_image
    const description = levelJSON.description
    const code = levelJSON.course_id.match(/.{3,3}/g).join("-")
    const title = levelJSON.name
    const uploader = levelJSON.uploader.name
    const uploaderCode = levelJSON.uploader.code.match(/.{3,3}/g).join("-")
    const likes = levelJSON.likes
    const plays = levelJSON.plays
    const attempts = levelJSON.attempts
    const clears = levelJSON.clears
    const tags = levelJSON.tags_name.filter(tag => tag != "None").join(", ")
    // const flag = ":flag_" + levelJSON.uploader.country.toLowerCase() + ":"

    // create fields (say if it is in thwomp only if it is)
    let fields = [
        { name: ":bust_in_silhouette: Plays", value: String(plays), inline: true },
        { name: ":heart: Likes", value: String(likes), inline: true },
        { name: ":footprints: Attempts", value: String(attempts), inline: true },
        { name: ":checkered_flag: Clears", value: String(clears), inline: true },
    ]
    const inThwomp = await ThwompEntry.findOne({ "course.id": levelJSON.course_id })
    if (inThwomp) fields.push({ name: "<:thwomp:984509792523522088> THWOMP", value: "This level is in THWOMP", inline: true})

    // create embed
    const levelEmbed = new MessageEmbed()
        .setColor(favoriteColor)
        .setTitle(title + " (" + code + ")")
        .setAuthor({ name: uploader + " (" + uploaderCode + ")", iconURL: miiThumbnail })
        //.addField(flag + " " + uploader, uploaderCode)
        .setDescription(description)
        //.setThumbnail(uploaderMii)
        .addFields(
            ...fields
        )
        .setImage("attachment://thumbnail.jpg")
        .setTimestamp()
        .setFooter({ text: tags })


    // return info
    return { embed: levelEmbed, attachment }

}

exports.level_embed = level_embed