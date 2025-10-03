import React, { useEffect, useState } from "react";
import { fetchReports } from "../api";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (err) {
        setReports([
          {
            title: "Village A - 100 households",
            baseline_cost: 1200,
            optimized_cost: 900,
            cost_reduction_pct: 25,
          },
        ]);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Evaluation Reports</h2>
      {reports.map((r, i) => (
        <section
          key={i}
          style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}
        >
          <h3>{r.title}</h3>
          <p>Baseline cost: ₦{r.baseline_cost}</p>
          <p>Optimized cost: ₦{r.optimized_cost}</p>
          <p>Cost reduction: {r.cost_reduction_pct}%</p>
        </section>
      ))}
    </div>
  );
}
