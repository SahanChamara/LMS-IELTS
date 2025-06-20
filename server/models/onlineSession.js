const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlineSessionSchema = new Schema({
    title: { type: String, required: true },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
    link: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('onlineSession', onlineSessionSchema);