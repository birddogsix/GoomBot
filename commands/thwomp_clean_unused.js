// remove all unused thwomp and course uploaders that are not being used in a level

const CourseUploader = require("../models/CourseUploader")
const ThwompEntry = require("../models/ThwompEntry")
const ThwompUploader = require("../models/ThwompUploader")

// requires

async function thwomp_clean_unused(parameters, commandName, message) {

    // get all entries
    const allEntries = await ThwompEntry.find({})

    // get all thwomp uploaders
    const allThwompUploaderIds = (await ThwompUploader.find({})).map(uploader => uploader._id)

    // remove all the ones with no levels having them
    const removableThwompUplaoderIds = allThwompUploaderIds.filter(id => !allEntries.some(entry => entry.thwomp.uploaders.find(uploaderId => uploaderId.equals(id))))

    // get all course uploaders
    const allCourseUploaderIds = (await CourseUploader.find({})).map(uploader => uploader._id)

    // remove all the ones without levels in THWOMP
    const removableCourseUploaderIds = allCourseUploaderIds.filter(id => !allEntries.some(entry => entry.course.uploader.equals(id)))

    // remove each removable thwomp uploader ids
    removableThwompUplaoderIds.forEach(id => {
        ThwompUploader.deleteOne({"_id": id}).catch(err => console.log(err))
    })

    // remove unused course uploaders
    removableCourseUploaderIds.forEach(id => {
        CourseUploader.deleteOne({"_id": id}).catch(err => console.log(err))
    })

    return `removed ${removableThwompUplaoderIds.length} unused THWOMP uploader${removableThwompUplaoderIds.length != 1 ? "s" : ""} and ${removableCourseUploaderIds.length} unused course uploader${removableCourseUploaderIds.length != 1 ? "s" : ""}`

}

exports.run = thwomp_clean_unused