const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user.id);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let users;
    users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role", error: err });
  }
};

exports.updateUserManager = async (req, res) => {
  const { manager } = req.body; 
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { manager: manager || null },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Manager assigned", user });
  } catch (err) {
    res.status(500).json({ message: "Error assigning manager", error: err });
  }
};