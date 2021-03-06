// create an embed for a maker

// requires
const { MessageEmbed } = require("discord.js")
const CourseUploader = require("../models/CourseUploader")
const ThwompEntry = require("../models/ThwompEntry")
const { mii_studio_to_code } = require("./mii_studio_code_to_color")

async function maker_embed(makerJSON) {

    // get info
    const favoriteColor = mii_studio_to_code(makerJSON.mii_studio_code)
    const code = makerJSON.code.match(/.{3,3}/g).join("-")
    const user = makerJSON.name
    const userMii = makerJSON.mii_image
    const flag = ":flag_" + makerJSON.country.toLowerCase() + ":"
    const played = makerJSON.courses_played
    const cleared = makerJSON.courses_cleared
    const attempted = makerJSON.courses_attempted
    const deaths = makerJSON.courses_deaths
    const likes = makerJSON.likes
    const makerPoints = makerJSON.maker_points
    const versusRank = makerJSON.versus_rank_name

    // get thwomp info
    const userInThwomp = await CourseUploader.findOne({ "id": makerJSON.code })
    const levelsInThwomp = await ThwompEntry.find({ "course.uploader": userInThwomp })
    const amountlit = levelsInThwomp.length

    // create fields (only include thwomp levels if they have at least one)
    let fields = [
        { name: ":heart: Likes", value: String(likes), inline: true },
        { name: ":heart_decoration: Maker Points", value: String(makerPoints), inline: true },
        { name: ":bar_chart: Versus Rank", value: versusRank, inline: true },
        { name: ":video_game: Courses Played", value: String(played), inline: true },
        { name: ":checkered_flag: Courses Cleared", value: String(cleared), inline: true },
        { name: ":footprints: Attempts", value: String(attempted), inline: true },
        { name: ":skull: Lives Lost", value: String(deaths), inline: true },
    ]
    if (amountlit > 0) fields.push({ name: "<:thwomp:984509792523522088> THWOMP Levels", value: String(amountlit), inline: true })

    // create embed
    const makerEmbed = new MessageEmbed()
        .setColor(favoriteColor)
        .setTitle(flag + " " + user + " (" + code + ")")
        .setThumbnail(userMii)
        .addFields(
            ...fields
        )
        .setTimestamp()

    // return info
    return { embed: makerEmbed }

}

exports.maker_embed = maker_embed