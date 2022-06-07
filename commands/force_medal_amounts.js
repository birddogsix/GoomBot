// when a member updates their nickname make sure their medals were constant and unchanged

const { getMedals } = require("../functions/get_medals")

// requires


async function force_medal_amounts(oldMember, newMember, clearances) {

    // get who did it
    const updateLogs = await newMember.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_UPDATE',
    })
    const updater = updateLogs.entries.first().executor

    // dont update it if a bot did it
    if (updater.bot) return

    // don't update it if it was a person with clearance
    const changedBy = await newMember.guild.members.fetch(updater.id)
    if (changedBy._roles.some(role => clearances.includes(role))) return

    const oldName = oldMember?.nickname || oldMember.user.username
    const newName = newMember?.nickname || newMember.user.username

    // get the number of medals
    const oldMedals = getMedals(oldName)
    const newMedals = getMedals(newName)

    // check if the number of medals has changed
    if (Object.keys(newMedals).some(key => newMedals[key] != oldMedals[key])) {

        let finalName

        // name with removed medals
        let lastMedalsIndex = newName.lastIndexOf(newName?.match(/ *-*(?: *[0-9]+(?:🥇|🥈|🥉))+/g)?.find((m, i, a) => i + 1 == a.length))
        let updatedName = newName
        if (lastMedalsIndex != -1) {
            updatedName = newName.split("").splice(0, lastMedalsIndex).join("")
        }

        // create each medal text type
        const oldNumberOfMedals = Object.values(oldMedals).reduce((a, b) => a + b)
        const longMedalText = `${oldNumberOfMedals > 0 ? " - " : ""}${oldMedals.gold > 0 ? oldMedals.gold + "🥇" : ""} ${oldMedals.silver > 0 ? oldMedals.silver + "🥈" : ""} ${oldMedals.bronze > 0 ? oldMedals.bronze + "🥉" : ""}`
        const shortMedalText = `${oldNumberOfMedals > 0 ? "-" : ""}${oldMedals.gold > 0 ? oldMedals.gold + "🥇" : ""}${oldMedals.silver > 0 ? oldMedals.silver + "🥈" : ""}${oldMedals.bronze > 0 ? oldMedals.bronze + "🥉" : ""}`

        // choose which length to add
        if (updatedName.length > 32 - longMedalText.length) {
            finalName = updatedName.split("").slice(0, 32 - shortMedalText.length).join("") + shortMedalText
        } else {
            finalName = updatedName + longMedalText
        }

        // remove extra dashes
        finalName = finalName.replace(/- *-/g, "-").replace(/ *$/g, "")

        // update name
        newMember.setNickname(finalName).catch(err => console.log(err))

        // send message to channel
        const notifChannel = await newMember.guild.channels.cache.get("974403970716037202")
        notifChannel.send(`Username update: \`${oldName}\` to \`${newName}\`. Updated to: \`${finalName}\``).catch(err => console.log(err))

    }

    // check if they added, removed, or changed their nickname
    // if (oldName || newName) {
    //     const oldMedals = getMedals(oldName)
    //     const oldNumberOfMedals = Object.values(oldMedals).reduce((a, b) => a + b)
    //     // check if they previously had medals
    //     const newMedals = getMedals(newName)
    //     // check if the number of medals has changed
    //     if (Object.keys(newMedals).some(key => newMedals[key] != oldMedals[key])) {
    //         let finalName
    //         if (newName && oldNumberOfMedals > 0) {
    //             // they changed their number of medals => update their username to include the medals
    //             let updatedName = newName.replace(/ *-* *[0-9]+(?:🥇|🥈|🥉)/g, "")
    //             const longMedalText = ` - ${oldMedals.gold > 0 ? oldMedals.gold + "🥇" : ""} ${oldMedals.silver > 0 ? oldMedals.silver + "🥈" : ""} ${oldMedals.bronze > 0 ? oldMedals.bronze + "🥉" : ""}`
    //             if (updatedName.length > 32 - longMedalText.length) {
    //                 const shortMedalText = `-${oldMedals.gold > 0 ? oldMedals.gold + "🥇" : ""}${oldMedals.silver > 0 ? oldMedals.silver + "🥈" : ""}${oldMedals.bronze > 0 ? oldMedals.bronze + "🥉" : ""}`
    //                 finalName = updatedName.split("").slice(0, 32 - shortMedalText.length).join("") + shortMedalText
    //             } else {
    //                 finalName = updatedName + longMedalText
    //             }
    //         } else {
    //             finalName = ""
    //         }
    //         // update name
    //         newMember.setNickname(finalName).catch(err => console.log(err))
    //         // send message to channel TODO
    //         const notifChannel = await newMember.guild.channels.cache.get("974403970716037202")
    //         notifChannel.send(`Username update: \`${oldName}\` to \`${newName}\`. Updated to: \`${finalName}\``).catch(err => console.log(err))
    //     }
    // }

}

exports.run = force_medal_amounts



// bird - 5🥇 4🥈 9🥉