// creates a pie graph for 

// requires
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")
const { MessageAttachment, MessageEmbed } = require("discord.js")
const { getPalette } = require("../functions/colorPalette")

async function createPieGraph(dataset, width = 400, height = 400) {

    const chart1 = new ChartJSNodeCanvas({ width, height })

    const config = {
        type: 'pie',
        data: {
            datasets: [{
                data: Object.values(dataset),
                backgroundColor: getPalette(Object.values(dataset).length)
            }],
            labels: Object.keys(dataset),
        },
    }

    const imageBuffer = await chart1.renderToBuffer(config, "image/png")
    const attachment = new MessageAttachment(imageBuffer, "pieChart.png")

    return attachment

}

exports.createPieGraph = createPieGraph