// extract the medal numbers from a nickname

//requires

function get_medals(nickname) {
    return {
        gold: parseInt(nickname?.match(/[0-9]+🥇/g)?.find((e, i, a) => i + 1 == a.length).replace("🥇", "")) || 0,
        silver: parseInt(nickname?.match(/[0-9]+🥈/g)?.find((e, i, a) => i + 1 == a.length).replace("🥈", "")) || 0,
        bronze: parseInt(nickname?.match(/[0-9]+🥉/g)?.find((e, i, a) => i + 1 == a.length).replace("🥉", "")) || 0,
    }
}

exports.getMedals = get_medals