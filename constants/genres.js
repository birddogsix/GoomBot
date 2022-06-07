const standard = ["standard"]
const art = ["art"]
const link = ["link"]
const auto = ["auto-mario", "automario", "auto"]
const singleplayer = ["singleplayer"]
const music = ["music"]
const boss = ["bossbattle", "boss"]
const multiplayer = ["multiplayerversus", "multiplayervs", "multiplayer"]
const themed = ["themed"]
const puzzle = ["puzzle-solving", "puzzlesolving", "puzzle"]
const sas = ["shortandsweet", "short"]
const technical = ["technical"]
const shooter = ["shooter"]

const mm2Genres = [
    ...standard,
    ...art,
    ...link,
    ...auto,
    ...singleplayer,
    ...music,
    ...boss,
    ...multiplayer,
    ...themed,
    ...puzzle,
    ...sas,
    ...technical,
    ...shooter
]

const genre_to_formatted = {
    ...standard.reduce((obj, key) => ({ ...obj, [key]: "Standard"}), {}),
    ...art.reduce((obj, key) => ({ ...obj, [key]: "Art"}), {}),
    ...link.reduce((obj, key) => ({ ...obj, [key]: "Link"}), {}),
    ...auto.reduce((obj, key) => ({ ...obj, [key]: "Auto mario"}), {}),
    ...singleplayer.reduce((obj, key) => ({ ...obj, [key]: "Single player"}), {}),
    ...music.reduce((obj, key) => ({ ...obj, [key]: "Music"}), {}),
    ...boss.reduce((obj, key) => ({ ...obj, [key]: "Boss battle"}), {}),
    ...multiplayer.reduce((obj, key) => ({ ...obj, [key]: "Multiplayer versus"}), {}),
    ...themed.reduce((obj, key) => ({ ...obj, [key]: "Themed"}), {}),
    ...puzzle.reduce((obj, key) => ({ ...obj, [key]: "Puzzle solving"}), {}),
    ...sas.reduce((obj, key) => ({ ...obj, [key]: "Short and sweet"}), {}),
    ...technical.reduce((obj, key) => ({ ...obj, [key]: "Technical"}), {}),
    ...shooter.reduce((obj, key) => ({ ...obj, [key]: "Shooter"}), {}),
}

exports.mm2Genres = mm2Genres
exports.gtf = genre_to_formatted