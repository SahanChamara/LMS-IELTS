const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    Instructor: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Announcements', AnnouncementsSchema);