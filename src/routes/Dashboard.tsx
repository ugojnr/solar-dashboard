import React, { useEffect, useState } from "react";
import { fetchBenchmarks } from "../api";
import ChartLine from "../components/ChartLine";

export default function Dashboard() {
  const [bench, setBench] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBenchmarks();
        setBench(data);
      } catch (err) {
        // demo fallback
        setBench({
          pv: [
            1, 2, 5, 8, 9, 10, 8, 6, 4, 2, 1, 0, 0, 1, 3, 5, 7, 8, 6, 4, 2, 1,
            0, 0,
          ],
          load: [
            2, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 2, 3, 4, 5, 4, 3, 2, 2, 1,
            1,
          ],
        });
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Benchmark Dashboard</h2>
      {bench && (
        <>
          <ChartLine
            labels={Array.from({ length: 24 }).map((_, i) => i.toString())}
            data={bench.pv}
            label="Avg PV (kW)"
          />
          <ChartLine
            labels={Array.from({ length: 24 }).map((_, i) => i.toString())}
            data={bench.load}
            label="Avg Load (kW)"
          />
        </>
      )}
    </div>
  );
}
