const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: String,
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Lost", "Won"],
    default: "New",
  },
  contactDate: Date,
  assignedTo: {
    type: String, 
    required: true,
  },
});

module.exports = mongoose.model("Lead", leadSchema);
