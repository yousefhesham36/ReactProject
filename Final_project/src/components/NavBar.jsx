import { useAuthStore } from "@/store/auth";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, clear } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom shadow-sm py-3">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-primary fs-4" to="/">
          My<span className="text-secondary">Blog</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            {token && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/posts"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "text-primary fw-bold" : "text-light"}`
                    }
                  >
                    Posts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "text-primary fw-bold" : "text-light"}`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {token ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    clear();
                    navigate("/login");
                  }}
                >
                  Log out
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item me-2">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `btn btn-sm ${isActive ? "btn-primary text-white" : "btn-outline-primary"}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `btn btn-sm ${isActive ? "btn-secondary text-white" : "btn-outline-secondary"}`
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
