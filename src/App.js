import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import logo from "./logo.svg";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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

function App() {
  const [query, setQuery] = useState("");
  const [chartData, setChartData] = useState(null);

  const mockData = {
    ngrams: [
      {
        ngram: "apple",
        data: [
          { year: 1900, frequency: 0.0001 },
          { year: 1950, frequency: 0.0003 },
          { year: 2000, frequency: 0.0008 },
          { year: 2010, frequency: 0.0012 },
        ],
      },
      {
        ngram: "banana",
        data: [
          { year: 1900, frequency: 0.00005 },
          { year: 1950, frequency: 0.0001 },
          { year: 2000, frequency: 0.0002 },
          { year: 2010, frequency: 0.00018 },
        ],
      },
    ],
  };

  const handleSearch = () => {
    if (!query) return;

    const yearsSet = new Set();
    mockData.ngrams.forEach((ng) => {
      ng.data.forEach((point) => yearsSet.add(point.year));
    });
    const years = Array.from(yearsSet).sort((a, b) => a - b);

    const datasets = mockData.ngrams.map((ng) => {
      const frequenciesByYear = {};
      ng.data.forEach((point) => {
        frequenciesByYear[point.year] = point.frequency;
      });
      return {
        label: ng.ngram,
        data: years.map((year) => frequenciesByYear[year] || 0),
        borderColor: getRandomColor(),
        backgroundColor: "rgba(0,0,0,0)",
      };
    });

    setChartData({
      labels: years,
      datasets: datasets,
    });
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Google Ngrams Mock Explorer</h1>
        <p>
          Type in one or more words, separated by commas (not actually queried,
          just mock data):
        </p>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. apple, banana"
            style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          />
          <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
            Search
          </button>
        </div>

        {chartData && (
          <div
            style={{
              width: "80%",
              height: "400px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Year",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Frequency (%)",
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                  title: {
                    display: true,
                    text: `Ngram Trends for: ${query}`,
                  },
                },
              }}
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
