// creates an embed for a thwomp database level to be sent

// requires
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { mii_studio_to_code } = require("./mii_studio_code_to_color");
const tgr = require("./tgrAPI")
const { ctg } = require("./thwomp_genre_code")

async function thwomp_level_embed(thwomp_level_info) {

    // get information like mii color, mii picture, and description that is not stored in thwomp_level_info
    const levelJSON = await tgr.levelSearch(thwomp_level_info.course.id)
    if (levelJSON?.error) return levelJSON.error
    const favoriteColor = mii_studio_to_code(levelJSON.uploader.mii_studio_code)
    const miiThumbnail = levelJSON.uploader.mii_image
    const description = levelJSON.description

    // get, convert, and save level thumbnail
    const thumbnail = await tgr.thumbnailSearch(thwomp_level_info.course.id)
    const thumbnailBuffer = new Buffer.from(thumbnail)
    const attachment = new MessageAttachment(thumbnailBuffer, "thumbnail.jpg")

    const levelEmbed = new MessageEmbed()
        .setColor(favoriteColor)
        .setTitle(thwomp_level_info.course.name + " (" + thwomp_level_info.course.id.replace(/(...)(...)(...)/, "$1-$2-$3") + ")")
        .setAuthor({ name: thwomp_level_info.course.uploader.name + " (" + thwomp_level_info.course.uploader.id.replace(/(...)(...)(...)/, "$1-$2-$3") + ")", iconURL: miiThumbnail })
        .setDescription(description)
        .addFields(
            { name: "Submitted by", value: thwomp_level_info.thwomp.uploaders.map(uploader => uploader.names[0]).join(", "), inline: true }
        )
        .setImage("attachment://thumbnail.jpg")
        .setFooter({ text: thwomp_level_info.thwomp.genres.map(genre => ctg[genre]).concat(thwomp_level_info.course.genres).join(", ") })
        .setTimestamp()

    return { embed: levelEmbed, attachment }

}

exports.thwomp_level_embed = thwomp_level_embed