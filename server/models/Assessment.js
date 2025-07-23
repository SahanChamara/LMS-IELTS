const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssessmentSchema = new Schema({
  title: { type: String, required: true },
  unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
  questionsCount: { type: Number, required: true },
  duration: { type: Number, required: true },
  passPercentage: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  caMarksPercetage: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assessment", AssessmentSchema);
