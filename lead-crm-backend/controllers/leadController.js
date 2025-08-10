const Lead = require('../models/Lead');
const User = require('../models/User');

exports.getAllLeads = async (req, res) => {
  try {
    let leads;

    if (req.user.role === "admin") {
      leads = await Lead.find().sort({ contactDate: -1 });
    }
    else if (req.user.role === "manager") {
      const salesUsers = await User.find({ role: "sales", manager: req.user.id });
      console.log("Sales Users:", salesUsers);
      const salesNames = salesUsers.map(u => u.name);

      leads = await Lead.find({ 
        assignedTo: { $in: [...salesNames, req.user.name] }
      }).sort({ contactDate: -1 });
    }  
    else {
      leads = await Lead.find({ assignedTo: req.user.name }).sort({ contactDate: -1 });
    }

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.createLead = async (req, res) => {
  const { name, company, status, contactDate, assignedTo } = req.body;

  try {
    const newLead = new Lead({
      name,
      company,
      status,
      contactDate,
      assignedTo
    });

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