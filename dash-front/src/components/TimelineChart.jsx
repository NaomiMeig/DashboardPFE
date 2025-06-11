import { Box } from "@mui/material";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const TimelineChart = ({ data }) => {
  // Transformez vos données pour le graphique ici
  const chartData = {
    labels: data.map((item) => item.date || item.id),
    datasets: [
      {
        label: "Valeurs",
        data: data.map((item) => item.value || 0),
        borderColor: "#8884d8",
        backgroundColor: "rgba(136, 132, 216, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Évolution temporelle",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
    },
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default TimelineChart;