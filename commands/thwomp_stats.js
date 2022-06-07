// get stats for thwomp levels

// requires
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")
const { MessageAttachment, MessageEmbed } = require("discord.js")

async function thwomp_stats(parameters, commandName, message) {

    const testData = [
        {
            "members": 1946,
            "date": "10/1/2020"
        },
        {
            "members": 2011,
            "date": "10/2/2020"
        },
        {
            "members": 2072,
            "date": "10/3/2020"
        },
        {
            "members": 2119,
            "date": "10/4/2020"
        },
        {
            "members": 2172,
            "date": "10/5/2020"
        },
    ]

    const members = testData.map(el => el.members)
    const dates = testData.map(el => el.date)

    const canvas = new ChartJSNodeCanvas(
        800,
        600,
        chartCallback
    )

    const config = {
        type: "bar",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "test",
                    data: members,
                    backgroundColor: "#7289d9"
                }
            ]
        }
    }

    const image = await canvas.renderToBuffer(config)
    const attachment = new MessageAttachment(image)

    return {
        embed: new MessageEmbed(),
        attachment,
    }

}

const chartCallback = (ChartJS) => { }

exports.run = thwomp_stats  