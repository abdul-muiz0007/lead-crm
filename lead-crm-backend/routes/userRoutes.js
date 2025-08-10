const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, userController.getUsers);
router.put("/:id/role", verifyToken, userController.updateUserRole);
router.put("/:id/manager", verifyToken, userController.updateUserManager);

module.exports = router;