import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!token) return null; 

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <NavLink className="navbar-brand" to="/">LeadCRM</NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/leads">Leads</NavLink>
          </li>
          {(role === "admin" || role === "manager") && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/users">Users</NavLink>
            </li>
          )}
        </ul>
        <ul className="navbar-nav align-items-center">
          <li className="nav-item me-3 text-white fw-bold">
            {user.name + " | " + user.role}
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;