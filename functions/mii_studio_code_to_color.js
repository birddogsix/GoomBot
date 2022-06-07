// convert a mii studio code to the mii's color

function mii_studio_to_code(mii_studio_code) {
    const miiColors = {
        "0": "#d21e14", // red
        "1": "#ff6d19", // orange
        "2": "#ffd820", // yellow
        "3": "#79d020", // lime
        "4": "#00772f", // green
        "5": "#0a48b3", // blue
        "6": "#3da9df", // cyan
        "7": "#f4597c", // pink
        "8": "#7328ae", // purple
        "9": "#483818", // brown
        "a": "#e0dfe1", // white
        "b": "#181714", // black
    }
    return miiColors[mii_studio_code.split("")[43]]
}

exports.mii_studio_to_code = mii_studio_to_code