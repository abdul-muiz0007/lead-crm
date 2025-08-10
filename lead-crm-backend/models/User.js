const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ["admin", "sales", "manager"], default: "sales" },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("User", userSchema);