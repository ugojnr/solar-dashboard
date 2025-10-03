import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProviders";
import { logout } from "../api";

export default function Header() {
  const { isAuthenticated, signOut } = useAuth();
  const nav = useNavigate();

  const doLogout = async () => {
    await logout();
    signOut();
    nav("/login");
  };

  return (
    <header className="site-header">
      <div className="container">
        <h1>Solar Research Platform</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/simulate">Simulate</Link>
          <Link to="/reports">Reports</Link>
          {!isAuthenticated ? (
            <Link to="/login">Sign in</Link>
          ) : (
            <a onClick={doLogout} style={{ cursor: "pointer", color: "white" }}>
              Sign out
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
