export function sampleHouseholdProfile(hours = 24) {
  const base = 0.05;
  return Array.from({ length: hours }).map((_, t) => {
    const morning = 0.15 * Math.exp(-0.5 * Math.pow((t - 7) / 1.5, 2));
    const evening = 0.4 * Math.exp(-0.5 * Math.pow((t - 19) / 2.0, 2));
    const noise = (Math.random() - 0.5) * 0.04;
    return Math.max(0, base + morning + evening + noise);
  });
}

export function pvProfile(hours = 24, capacityKw = 10, clearness = 1.0) {
  return Array.from({ length: hours }).map(
    (_, t) =>
      Math.max(0, Math.sin(((t - 6) / 12) * Math.PI)) * capacityKw * clearness
  );
}

export function runDaySim({ nHouseholds = 100, pvKw = 20, battKwh = 50 }) {
  const hours = 24;
  const loads = Array.from({ length: nHouseholds }).map(() =>
    sampleHouseholdProfile(hours)
  );
  const aggregateLoad = Array.from({ length: hours }).map((_, h) =>
    loads.reduce((s, arr) => s + arr[h], 0)
  );
  const pv = pvProfile(hours, pvKw);
  let battSoc = battKwh * 0.5;
  const battHist: number[] = [];
  const gridImport = new Array(hours).fill(0);
  for (let h = 0; h < hours; h++) {
    const net = pv[h] - aggregateLoad[h];
    if (net >= 0) {
      const charge = Math.min(net, battKwh - battSoc);
      battSoc += charge;
    } else {
      const need = -net;
      const supply = Math.min(need, battSoc);
      battSoc -= supply;
      const remain = need - supply;
      gridImport[h] = remain;
    }
    battHist.push(battSoc);
  }
  const totalLoad = aggregateLoad.reduce((a, b) => a + b, 0);
  const totalPv = pv.reduce((a, b) => a + b, 0);
  const totalGrid = gridImport.reduce((a, b) => a + b, 0);
  const unmet = 0;
  return {
    aggregateLoad,
    pv,
    battHist,
    gridImport,
    totalLoad,
    totalPv,
    totalGrid,
    unmet,
  };
}
