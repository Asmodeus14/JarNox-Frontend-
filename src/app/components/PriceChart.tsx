"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  labels: string[];
  data: number[];
}

export default function PriceChart({ labels, data }: PriceChartProps) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Close Price (USD)",
            data,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.2
          }
        ]
      }}
      options={{
        responsive: true,
        plugins: { legend: { position: "top" } }
      }}
    />
  );
}
