const mg = require("mongoose")

const ThwompUploader = mg.Schema({
    names: { type: Array },
    id: { type: String, required: true },
    isStreamer: { type: Boolean },
    streamerInfo: {
        link: { type: String },
        viewerLevels: { type: Boolean },
    }
})

module.exports = mg.model("ThwompUploader", ThwompUploader)