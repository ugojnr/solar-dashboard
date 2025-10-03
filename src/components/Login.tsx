import React, { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProviders";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const nav = useNavigate();

  const doLogin = async (e: any) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data?.access_token) {
        signIn(data.access_token);
        nav("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Sign in</h2>
      <form onSubmit={doLogin} style={{ display: "grid", gap: 8 }}>
        <label>
          Username{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign in</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
