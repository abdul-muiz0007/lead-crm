import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("viewer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
          role,
        });
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="mb-4">{isRegistering ? "Register" : "Login"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={name}
                     onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={role}
                      onChange={(e) => setRole(e.target.value)} required>
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div className="text-center mt-3">
        <button className="btn btn-link" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;