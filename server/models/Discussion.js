const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscussionSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    instructor: {type: Schema.Types.ObjectId, ref: 'Instructor' },
    unit: {type: Schema.Types.ObjectId, ref: 'Unit' },
    content: [{
        user: String, enum: ['Student', 'Instructor'],
        msg: String,
        timestamp: Date,
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

DiscussionSchema.index({unit: 1, instructor: 1, createdAt: -1});

module.exports = mongoose.model('Discussion', DiscussionSchema);