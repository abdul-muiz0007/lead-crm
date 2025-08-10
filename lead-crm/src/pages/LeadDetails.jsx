import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLead(res.data);
      setStatus(res.data.status);
    } catch (err) {
      console.error("Error fetching lead:", err);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/leads/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lead status updated!");
      navigate("/leads");
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Lead deleted successfully!");
      navigate("/leads");
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  if (!lead) return <p>Loading lead details...</p>;

  return (
    <div className="container">
      <h2 className="mb-3">{lead.name}</h2>
      <p>
        <strong>Company:</strong> {lead.company}
      </p>
      <p>
        <strong>Status:</strong> {lead.status}
      </p>
      <p>
        <strong>Contact Date:</strong>{" "}
        {new Date(lead.contactDate).toLocaleDateString()}
      </p>
      {lead.assignedTo && (
        <p>
          <strong>Assigned To:</strong> {lead.assignedTo.name}
        </p>
      )}

      <div className="mt-4">
        <label className="form-label">Update Status</label>
        <select
          className="form-select w-50"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-success" onClick={handleStatusUpdate}>
            Save Status
          </button>
          <button className="btn btn-danger" onClick={handleDeleteLead}>
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
