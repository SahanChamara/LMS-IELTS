const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  type: {
    type: String,
    enum: ['course_performance', 'student_engagement', 'gradebook'],
    required: true
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'generatedByModel'
  },
  generatedByModel: {
    type: String,
    required: true,
    enum: ['SuperAdmin', 'Instructor', 'Student']
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  format: {
    type: String,
    enum: ['pdf', 'csv'],
    default: 'pdf'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Report', ReportSchema);