

const standard = ["standard"]
const art = ["art"]
const link = ["link"]
const autoMario = ["auto-mario", "auto mario", "auto", "automario"]
const autoscroll = ["autoscroll", "auto-scroll", "auto scroll"]
const singleplayer = ["singleplayer", "single player"]
const music = ["music"]
const boss = ["bossbattle", "boss", "boss battle"]
const multiplayer = ["multiplayerversus", "multiplayervs", "multiplayer", "multiplayer vs", "multiplayer versus"]
const themed = ["themed"]
const puzzle = ["puzzle-solving", "puzzlesolving", "puzzle", "puzzle solving"]
const sas = ["shortandsweet", "short", "short and sweet"]
const technical = ["technical"]
const shooter = ["shooter"]
const speedrun = ["speedrun"]

const mm2Genres = [
    ...standard,
    ...art,
    ...link,
    ...autoMario,
    ...autoscroll,
    ...singleplayer,
    ...music,
    ...boss,
    ...multiplayer,
    ...themed,
    ...puzzle,
    ...sas,
    ...technical,
    ...shooter,
    ...speedrun
]

const genre_to_formatted = {
    ...standard.reduce((obj, key) => ({ ...obj, [key]: "Standard"}), {}),
    ...art.reduce((obj, key) => ({ ...obj, [key]: "Art"}), {}),
    ...link.reduce((obj, key) => ({ ...obj, [key]: "Link"}), {}),
    ...autoMario.reduce((obj, key) => ({ ...obj, [key]: "Auto mario"}), {}),
    ...singleplayer.reduce((obj, key) => ({ ...obj, [key]: "Single player"}), {}),
    ...music.reduce((obj, key) => ({ ...obj, [key]: "Music"}), {}),
    ...boss.reduce((obj, key) => ({ ...obj, [key]: "Boss battle"}), {}),
    ...multiplayer.reduce((obj, key) => ({ ...obj, [key]: "Multiplayer versus"}), {}),
    ...themed.reduce((obj, key) => ({ ...obj, [key]: "Themed"}), {}),
    ...puzzle.reduce((obj, key) => ({ ...obj, [key]: "Puzzle solving"}), {}),
    ...sas.reduce((obj, key) => ({ ...obj, [key]: "Short and sweet"}), {}),
    ...technical.reduce((obj, key) => ({ ...obj, [key]: "Technical"}), {}),
    ...shooter.reduce((obj, key) => ({ ...obj, [key]: "Shooter"}), {}),
    ...speedrun.reduce((obj, key) => ({ ...obj, [key]: "Speedrun"}), {}),
    ...autoscroll.reduce((obj, key) => ({ ...obj, [key]: "Autoscroll"}), {}),
}

exports.mm2Genres = mm2Genres
exports.gtf = genre_to_formatted