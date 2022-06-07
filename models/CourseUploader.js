const mg = require("mongoose")

const CourseUploader = mg.Schema({
    name: { type: String },
    id: { type: String, required: true }
})

module.exports = mg.model("CourseUploader", CourseUploader)