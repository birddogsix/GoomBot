const fetch = require("node-fetch")

async function levelSearch(code) {
    const searchURL = "https://tgrcode.com/mm2/level_info/" + code
    const result = await fetch(searchURL) // sometimes returns an internal server error
    const levelJson = await result.json().catch(err => {
        console.log(err)
        return {error: "Something went wrong when trying to gather the information. Please try again in a few minutes."}
    })
    return levelJson
}

async function makerSearch(code) {
    const searchURL = "https://tgrcode.com/mm2/user_info/" + code
    const result = await fetch(searchURL)
    const makerJson = await result.json().catch(err => {
        console.log(err)
        return { error: "Something went wrong when trying to gather the information. Please try again in a few minutes." }
    })
    return makerJson
}

async function thumbnailSearch(code) {
    const searchURL = "https://tgrcode.com/mm2/level_thumbnail/" + code
    const result = await fetch(searchURL)
    return await result.arrayBuffer()
}

async function endlessSearch(difficulty) {
    const searchURL = "https://tgrcode.com/mm2/search_endless_mode?count=1&difficulty=" + difficulty
    const result = await fetch(searchURL)
    const levelJsons = await result.json().catch(err => {
        console.log(err)
        return { error: "Something went wrong when trying to gather the information. Please try again in a few minutes." }
    })
    return levelJsons.courses[0]
}

async function newSearch() {
    const searchURL = "https://tgrcode.com/mm2/search_new?count=1"
    const result = await fetch(searchURL)
    const levelJsons = await result.json().catch(err => {
        console.log(err)
        return { error: "Something went wrong when trying to gather the information. Please try again in a few minutes." }
    })
    return levelJsons.courses[0]
}

exports.newSearch = newSearch
exports.endlessSearch = endlessSearch
exports.levelSearch = levelSearch
exports.makerSearch = makerSearch
exports.thumbnailSearch = thumbnailSearch
