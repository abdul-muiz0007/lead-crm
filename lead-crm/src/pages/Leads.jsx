import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LeadForm from "../components/LeadForm";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");

  // Check role (simple frontend role-based access)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") setIsAdmin(true);
  }, []);

  // Fetch leads from backend
  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateOrUpdate = async (leadData) => {
    try {
      if (editingLead) {
        // Update
        await axios.put(`http://localhost:5000/api/leads/${editingLead._id}`, leadData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingLead(null);
      } else {
        // Create
        await axios.post("http://localhost:5000/api/leads", leadData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchLeads();
    } catch (err) {
      console.error("Failed to save lead", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "" || lead.status === statusFilter)
  );

  return (
    <div>
      <h1 className="mb-4">Leads</h1>

      {isAdmin && (
        <div className="mb-4">
          <h5>{editingLead ? "Edit Lead" : "Add New Lead"}</h5>
          <LeadForm
            onSubmit={handleCreateOrUpdate}
            initialData={editingLead}
          />
        </div>
      )}

      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select w-25"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Status</th>
            <th>Contact Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No leads found.</td>
            </tr>
          ) : (
            filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.company}</td>
                <td>{lead.status}</td>
                <td>{new Date(lead.contactDate).toLocaleDateString()}</td>
                <td className="d-flex gap-2">
                  <Link to={`/leads/${lead._id}`} className="btn btn-sm btn-primary">
                    View
                  </Link>
                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => setEditingLead(lead)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(lead._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;