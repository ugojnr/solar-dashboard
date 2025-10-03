import React, { useState } from "react";

export default function SimulationForm({
  onRun,
}: {
  onRun: (params: any) => void;
}) {
  const [nHouseholds, setNHouseholds] = useState(100);
  const [pvKw, setPvKw] = useState(20);
  const [battKwh, setBattKwh] = useState(50);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onRun({ nHouseholds, pvKw, battKwh });
      }}
      style={{ display: "grid", gap: 8 }}
    >
      <label>
        Number of households
        <input
          type="number"
          value={nHouseholds}
          onChange={(e) => setNHouseholds(Number(e.target.value))}
        />
      </label>
      <label>
        PV capacity (kW)
        <input
          type="number"
          value={pvKw}
          onChange={(e) => setPvKw(Number(e.target.value))}
        />
      </label>
      <label>
        Battery capacity (kWh)
        <input
          type="number"
          value={battKwh}
          onChange={(e) => setBattKwh(Number(e.target.value))}
        />
      </label>
      <button type="submit">Run Simulation</button>
    </form>
  );
}
