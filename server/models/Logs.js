const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", LogSchema);