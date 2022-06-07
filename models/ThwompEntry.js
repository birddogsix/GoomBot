const mg = require("mongoose")
const Uploader = require("./CourseUploader")

const ThwompEntry = mg.Schema({
    course: {
        name: { type: String, required: true },
        id: { type: String, required: true },
        genres: { type: Array },
        difficulty: { type: String },
        uploaded: { type: Number },
        uploader: { type: mg.Schema.Types.ObjectId, ref: "CourseUploader" }
    },
    thwomp: {
        genres: { type: Array, required: true },
        modified: { type: Number },
        uploaded: { type: Number },
        uploaders: [{ type: mg.Schema.Types.ObjectId, ref: "ThwompUploader" }]
    }
})

module.exports = mg.model("ThwompEntry", ThwompEntry)