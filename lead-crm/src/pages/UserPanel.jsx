import { useEffect, useState } from "react";
import axios from "axios";

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
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

  return (
    <div>
      <h2>User Management</h2>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Change Role</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="form-select"
                >
                  <option value="admin">admin</option>
                  <option value="sales">sales</option>
                  <option value="viewer">viewer</option>
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