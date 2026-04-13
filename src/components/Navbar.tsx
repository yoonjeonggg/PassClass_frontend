import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PassClass</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/lectures"
            className={`nav-link ${isActive("/lectures") ? "active" : ""}`}
          >
            강의
          </Link>
          <Link
            to="/certificates"
            className={`nav-link ${isActive("/certificates") ? "active" : ""}`}
          >
            자격증
          </Link>
          {user && (
            <Link
              to="/my-lectures"
              className={`nav-link ${isActive("/my-lectures") ? "active" : ""}`}
            >
              내 수강
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <button
                className="user-trigger"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="user-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" />
                  ) : (
                    <span>{user.nickname[0]}</span>
                  )}
                </div>
                <span className="user-name">{user.nickname}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {menuOpen && (
                <div className="dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>👤</span> 내 프로필
                  </Link>
                  <Link
                    to="/my-lectures"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>📚</span> 내 수강 목록
                  </Link>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <span>🚪</span> 로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link
                to="/login"
                className="btn btn-ghost"
                style={{ padding: "10px 18px", fontSize: "14px" }}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                style={{ padding: "10px 18px", fontSize: "14px" }}
              >
                시작하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
