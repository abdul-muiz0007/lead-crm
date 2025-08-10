import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Breadcrumbs from "./Breadcrumbs";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
};

export default PrivateRoute;