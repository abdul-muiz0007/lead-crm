import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <NavLink className="navbar-brand" to="/">LeadCRM</NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {token && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/leads">Leads</NavLink>
              </li>
            </>
          )}
        </ul>
        <ul className="navbar-nav">
          {token ? (
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;