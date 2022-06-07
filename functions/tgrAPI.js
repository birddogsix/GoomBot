const fetch = require("node-fetch")

async function levelSearch(code) {
    const searchURL = "https://tgrcode.com/mm2/level_info/" + code
    const result = await fetch(searchURL)
    const levelJson = await result.json().catch(err => console.log(err)) || {error: "Something went wrong when trying to gather the level information. Please try again in a few minutes."}
    return levelJson
}

async function makerSearch(code) {
    const searchURL = "https://tgrcode.com/mm2/user_info/" + code
    const result = await fetch(searchURL)
    const levelJson = await result.json().catch(err => console.log(err)) || {error: "Something went wrong when trying to gather the maker information. Please try again in a few minutes."}
    return levelJson
}

async function thumbnailSearch(code) {
    const searchURL = "https://tgrcode.com/mm2/level_thumbnail/" + code
    const result = await fetch(searchURL)
    return await result.arrayBuffer()
}

exports.levelSearch = levelSearch
exports.makerSearch = makerSearch
exports.thumbnailSearch = thumbnailSearch
