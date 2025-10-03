import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ChartLine({
  labels,
  data,
  label,
}: {
  labels: string[];
  data: number[];
  label: string;
}) {
  const cfg = {
    labels,
    datasets: [{ label, data, tension: 0.3 }],
  };
  return (
    <div style={{ maxWidth: "900px" }}>
      <Line data={cfg} />
    </div>
  );
}
