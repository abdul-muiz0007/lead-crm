const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, leadController.getAllLeads);
router.get("/:id", verifyToken, leadController.getLeadById); 
router.post("/", verifyToken, leadController.createLead);
router.put("/:id", verifyToken, leadController.updateLead);
router.delete("/:id", verifyToken, leadController.deleteLead);

module.exports = router;