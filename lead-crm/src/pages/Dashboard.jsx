import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") setIsAdmin(true);
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(res.data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchLeads();
  }, []);

  const getCountByStatus = (status) =>
    leads.filter((lead) => lead.status === status).length;

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Leads</h5>
              <p className="card-text fs-4">{leads.length}</p>
            </div>
          </div>
        </div>
        {["New", "Contacted", "Qualified", "Won", "Lost"].map((status) => (
          <div className="col-md-3" key={status}>
            <div className="card text-white bg-secondary mb-3">
              <div className="card-body">
                <h6 className="card-title">{status}</h6>
                <p className="card-text fs-5">{getCountByStatus(status)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4>Recent Leads</h4>
      <ul className="list-group">
        {leads
          .sort((a, b) => new Date(b.contactDate) - new Date(a.contactDate))
          .slice(0, 5)
          .map((lead) => (
            <li className="list-group-item" key={lead._id}>
              {lead.name} — {lead.status} —{" "}
              {new Date(lead.contactDate).toLocaleDateString()}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Dashboard;
