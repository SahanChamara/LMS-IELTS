const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CertificateSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  issueDate: { type: Date, default: Date.now },
  pdfUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

CertificateSchema.index({ student: 1, course: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);