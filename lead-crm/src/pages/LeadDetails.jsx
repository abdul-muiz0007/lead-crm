import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") setIsAdmin(true);
  }, []);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLead(res.data);
      } catch (err) {
        console.error("Failed to load lead", err);
        navigate("/leads");
      }
    };

    fetchLead();
  }, [id, navigate, token]);

  if (!lead) return <p>Loading...</p>;

  return (
    <div>
      <h2>Lead Details</h2>
      <ul className="list-group">
        <li className="list-group-item"><strong>Name:</strong> {lead.name}</li>
        <li className="list-group-item"><strong>Company:</strong> {lead.company}</li>
        <li className="list-group-item"><strong>Status:</strong> {lead.status}</li>
        <li className="list-group-item"><strong>Contact Date:</strong> {new Date(lead.contactDate).toLocaleDateString()}</li>
        <li className="list-group-item"><strong>ID:</strong> {lead._id}</li>
      </ul>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/leads")}>
        Back to Leads
      </button>
    </div>
  );
};

export default LeadDetails;