const mg = require("mongoose")

const ThwompUploader = mg.Schema({
    name: { type: String },
    id: { type: String, required: true }
})

module.exports = mg.model("ThwompUploader", ThwompUploader)