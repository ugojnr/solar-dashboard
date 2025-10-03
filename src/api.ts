import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

// Simple token helpers (localStorage)
export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}
export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

// Attach token to requests
api.interceptors.request.use((cfg) => {
  const token = getAccessToken();
  if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
  return cfg;
});

export async function login(username: string, password: string) {
  const res = await api.post("/api/auth/login", { username, password });
  if (res.data?.access_token) {
    setAccessToken(res.data.access_token);
  }
  return res.data;
}

export async function logout() {
  setAccessToken(null);
}

export async function postSimulation(params: any) {
  const res = await api.post("/api/simulations", params);
  return res.data;
}

export async function fetchSimulation(id: string) {
  const res = await api.get(`/api/simulations/${id}`);
  return res.data;
}

export async function fetchBenchmarks() {
  const res = await api.get("/api/benchmarks");
  return res.data;
}

export async function fetchReports() {
  const res = await api.get("/api/reports");
  return res.data;
}
