export function saveCSV(result: any) {
  // CSV for PV, Load, Battery per hour
  const rows = ["hour,pv,load,batt"];
  for (let i = 0; i < 24; i++)
    rows.push(
      `${i},${result.pv[i]},${result.aggregateLoad[i]},${result.battHist[i]}`
    );
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "simulation.csv";
  a.click();
  URL.revokeObjectURL(url);
}
