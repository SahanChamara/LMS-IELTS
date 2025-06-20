const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//assessmentSubmision

const SubmissionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  score: { type: Number },
  totalMarks: { type: Number },
  grade: { type: String , enum: ['pass', 'fail'], default: 'fail'},
  submittedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);