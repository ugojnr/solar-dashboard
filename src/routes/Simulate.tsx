import React, { useState } from "react";
import SimulationForm from "../components/SimulationForm";
import { runDaySim } from "../utils/simulator";
import ChartLine from "../components/ChartLine";
import { postSimulation, fetchSimulation } from "../api";

export default function Simulate() {
  const [result, setResult] = useState<any>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const onRun = async (params: any, server = false) => {
    if (server) {
      try {
        const res = await postSimulation(params);
        // backend returns job id
        setJobId(res.id);
        // poll for result (simple polling)
        const fetchRes = await fetchSimulation(res.id);
        setResult(fetchRes);
        return;
      } catch (err) {
        console.warn("server sim failed", err);
      }
    }
    const res = runDaySim(params);
    setResult(res);
  };

  return (
    <div className="container">
      <h2>Simulation</h2>
      <SimulationForm onRun={onRun} />
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => {
            /* Run on server */
          }}
        >
          Run on Server
        </button>
      </div>
      {result && (
        <section>
          <h3>Results</h3>
          <p>Total Load: {result.totalLoad.toFixed(2)} kWh</p>
          <p>Total PV: {result.totalPv.toFixed(2)} kWh</p>
          <p>Total Grid Import: {result.totalGrid.toFixed(2)} kWh</p>
          <ChartLine
            labels={Array.from({ length: 24 }).map((_, i) => i.toString())}
            data={result.pv}
            label="PV (kW)"
          />
          <ChartLine
            labels={Array.from({ length: 24 }).map((_, i) => i.toString())}
            data={result.aggregateLoad}
            label="Load (kW)"
          />
          <ChartLine
            labels={Array.from({ length: 24 }).map((_, i) => i.toString())}
            data={result.battHist}
            label="Battery SOC (kWh)"
          />
        </section>
      )}
    </div>
  );
}
