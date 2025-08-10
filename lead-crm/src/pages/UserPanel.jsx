import { useEffect, useState } from "react";
import axios from "axios";

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "sales" });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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
        u => u.role === "sales" && u.manager === user.id
      );
    } 
    else {
      filteredUsers = allUsers.filter(u => u._id === user._id);
    }

    setUsers(filteredUsers);
    setManagers(res.data.filter(u => u.role === "manager"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    await axios.put(
      `http://localhost:5000/api/users/${id}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };
  
  const assignManager = async (id, managerId) => {
    await axios.put(
      `http://localhost:5000/api/users/${id}/manager`,
      { manager: managerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  const createUser = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/register",
      newUser,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewUser({ name: "", email: "", password: "", role: "sales" });
    fetchUsers();
    const modal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"));
    modal.hide();
  };

  return (
    <div>
      <h2>User Management</h2>
      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#createUserModal"
      >
        Create User
      </button>

      <div className="modal fade" id="createUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Name"
                className="form-control mb-2"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-2"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="form-control mb-2"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <select
                className="form-select mb-2"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="sales">sales</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-success" onClick={createUser}>Save User</button>
            </div>
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Change Role</th><th>Assign Manager</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="form-select"
                >
                  <option value="admin">admin</option>
                  <option value="sales">sales</option>
                  <option value="manager">manager</option>
                </select>
              </td>
              <td>
                <select
                  value={user.manager || ""}
                  onChange={(e) => assignManager(user._id, e.target.value)}
                  className="form-select"
                  disabled={user.role === "admin" || user.role === "manager"}
                >
                  <option value="">-- No Manager --</option>
                  {managers.map(m => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPanel;