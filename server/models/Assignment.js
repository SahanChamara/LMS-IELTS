const mongoose = require("mongoose");

// const { mod } = require("three/tsl");

const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
    title: { type: String, required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    passPercentage: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    file: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
