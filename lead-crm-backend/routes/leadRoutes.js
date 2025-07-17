const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, leadController.getAllLeads);
router.get("/:id", verifyToken, leadController.getLeadById); // Add this in controller
router.post("/", verifyToken, requireAdmin, leadController.createLead);
router.put("/:id", verifyToken, requireAdmin, leadController.updateLead);
router.delete("/:id", verifyToken, requireAdmin, leadController.deleteLead);

module.exports = router;