import axios, { AxiosError } from "axios";

// --- CONFIG ---
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// --- TYPES ---
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

export interface Report {
  id?: string;
  title: string;
  baseline_cost: number;
  optimized_cost: number;
  cost_reduction_pct: number;
}

export interface SimulationParams {
  nHouseholds: number;
  pvKw: number;
  battKwh: number;
}

export interface SimulationResult {
  aggregateLoad: number[];
  pv: number[];
  battHist: number[];
  gridImport: number[];
  totalLoad: number;
  totalPv: number;
  totalGrid: number;
  unmet: number;
}

// --- TOKEN HELPERS ---
export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

// --- INTERCEPTOR: attach token automatically ---
api.interceptors.request.use((cfg) => {
  const token = getAccessToken();
  if (token) {
    cfg.headers = {
      ...cfg.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return cfg;
});

// --- AUTH ---
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/api/auth/login", {
    username,
    password,
  });
  if (res.data?.access_token) {
    setAccessToken(res.data.access_token);
  }
  return res.data;
}

export async function logout() {
  setAccessToken(null);
}

// --- SIMULATION ---
export async function postSimulation(
  params: SimulationParams
): Promise<{ jobId: string }> {
  try {
    const res = await api.post<{ jobId: string }>("/api/simulations", params);
    return res.data;
  } catch (err) {
    console.error("Failed to start simulation:", err);
    throw err;
  }
}

export async function fetchSimulation(id: string): Promise<SimulationResult> {
  try {
    const res = await api.get<SimulationResult>(`/api/simulations/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch simulation ${id}:`, err);
    throw err;
  }
}

// --- BENCHMARKS ---
export async function fetchBenchmarks(): Promise<any[]> {
  try {
    const res = await api.get<any[]>("/api/benchmarks");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch benchmarks:", err);
    return [];
  }
}

// --- REPORTS ---
export async function fetchReports(): Promise<Report[]> {
  try {
    const res = await api.get<Report[]>("/api/reports");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch reports:", err);

    // fallback: return demo data so frontend still renders
    return [
      {
        title: "Village A - 100 households",
        baseline_cost: 1200,
        optimized_cost: 900,
        cost_reduction_pct: 25,
      },
    ];
  }
}
