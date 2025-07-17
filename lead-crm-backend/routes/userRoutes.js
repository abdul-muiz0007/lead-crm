const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");

// Get all users
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user role
router.put("/:id/role", verifyToken, requireAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});

module.exports = router;