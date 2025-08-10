import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    status: "New",
    contactDate: "",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [isAdminOrManager, setIsAdminOrManager] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "manager") {
      setIsAdminOrManager(true);
    }
    fetchLeads();
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allUsers = res.data;
    let filteredUsers = [];

    if (user.role === "admin") {
      filteredUsers = allUsers;
    } 
    else if (user.role === "manager") {
      filteredUsers = allUsers.filter(
        u => (u.role === "sales" && u.manager === user.id) || u.role === "manager"
      );
    } 
    else {
      filteredUsers = allUsers.filter(u => u._id === user._id);
    }
    setUsers(filteredUsers);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? lead.status === statusFilter : true;

    const matchesUser = userFilter ? lead.assignedTo === userFilter : true;

    return matchesSearch && matchesStatus && matchesUser;
  });

  const uniqueUsers = [...new Set(leads.map((lead) => lead.assignedTo))];

  const createLead = async () => {
    try {
      await axios.post("http://localhost:5000/api/leads", newLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Lead created successfully!");
      setNewLead({
        name: "",
        company: "",
        status: "New",
        contactDate: "",
        assignedTo: "",
      });
      fetchLeads();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createLeadModal")
      );
      modal.hide();
    } catch (err) {
      console.error(err);
      alert("Error creating lead");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Leads</h1>
        <button
          className="btn btn-primary mb-3"
          data-bs-toggle="modal"
          data-bs-target="#createLeadModal"
        >
          Create Lead
        </button>

        <div
          className="modal fade"
          id="createLeadModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Lead</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Name"
                  className="form-control mb-2"
                  value={newLead.name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="form-control mb-2"
                  value={newLead.company}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company: e.target.value })
                  }
                  required
                />
                <select
                  className="form-select mb-2"
                  value={newLead.status}
                  onChange={(e) =>
                    setNewLead({ ...newLead, status: e.target.value })
                  }
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newLead.contactDate}
                  onChange={(e) =>
                    setNewLead({ ...newLead, contactDate: e.target.value })
                  }
                  required
                />
                <select
                  className="form-select"
                  value={newLead.assignedTo}
                  onChange={(e) =>
                    setNewLead({ ...newLead, assignedTo: e.target.value })
                  }
                >
                  <option value="">Select assignee</option>
                  {users.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-success" onClick={createLead}>
                  Save Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
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

        {isAdminOrManager && (
          <div className="col-md-3 mt-2">
            <select
              className="form-select"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Contact Date</th>
            {user?.role === "admin" && <th>Assigned To</th>}
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead._id}>
              <td>
                <Link to={`/leads/${lead._id}`}>{lead.name}</Link>
              </td>
              <td>{lead.company}</td>
              <td>{lead.status}</td>
              <td>{lead.assignedTo || "N/A"}</td>
              <td>{new Date(lead.contactDate).toLocaleDateString()}</td>
              {user?.role === "admin" && <td>{lead.assignedTo || "N/A"}</td>}
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(lead._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;
