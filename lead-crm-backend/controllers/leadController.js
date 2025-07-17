const Lead = require('../models/Lead');

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ contactDate: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.createLead = async (req, res) => {
  const { name, company, status, contactDate } = req.body;

  try {
    const newLead = new Lead({ name, company, status, contactDate });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};

exports.updateLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Error updating lead' });
  }
};

exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    await Lead.findByIdAndDelete(id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting lead' });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving lead" });
  }
};