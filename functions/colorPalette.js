function getPalette(amount) {

    // this is kind of dumb but whatever
    let colors = [
        "#CC6677",
        "#332288",
        "#DDCC77",
        "#117733",
        "#88CCEE",
        "#882255",
        "#44AA99",
        "#999933",
        "#AA4499",
    ]

    //mix colors until we get enough colors
    let colorsRGB = colors.map(color => hexToRgb(color))
    while (amount > colorsRGB.length) {
        colorsRGB.forEach((color, i, arr) => {
            if (i + 1 < arr.length) colorsRGB.push(mix(color, arr[i + 1]))
        })
        // remove duplicates
        colorsRGB = colorsRGB.map(color => rgbToHex(color.r, color.g, color.b))
        colorsRGB = colorsRGB.filter((color, i, a) => a.indexOf(color) == i)
        colorsRGB = colorsRGB.map(color => hexToRgb(color))
    }
    colors = colorsRGB.map(color => rgbToHex(color.r, color.g, color.b))

    colors = colors.splice(0, amount)
    return colors
}

function mix(rgb1, rgb2) {
    r = (rgb1.r + rgb2.r) >> 1
    g = (rgb1.g + rgb2.g) >> 1
    b = (rgb1.b + rgb2.b) >> 1
    return { r, g, b }
}

// thanks internet
function hexToRgb(hex) {
    let bigint = parseInt(hex.replace(/#/, ""), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return { r, g, b };
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

exports.getPalette = getPalette