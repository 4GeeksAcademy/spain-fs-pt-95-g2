import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <div className="container-fluid d-flex justify-content-end align-items-center">
        {!isLogged ? (
          <Link to="/signin">
            <button className="btn btn-outline-dark">LOGIN</button>
          </Link>
        ) : (
          <Link to="/profile">
            <AccountCircleIcon style={{ fontSize: 32, color: "#111" }} />
          </Link>
        )}
      </div>
    </nav>
  );
};
