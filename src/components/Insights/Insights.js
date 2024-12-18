import React, { useState, useEffect } from "react";
import { Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip, 
  Legend,
} from "chart.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./Insights.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Legend
);

const Insights = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("population");
  
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "nutritionData"));
      const rawData = snapshot.docs.map((doc) => doc.data());
      setData(rawData);
    };

    fetchData();
  }, []);

  // Prepare data for the Population Pyramid (Stacked Bar Chart)
  // Add "Severe Wasting" to the pyramidData.datasets
  const pyramidData = {
    labels: data.map((item) => item.country),
    datasets: [
      {
        label: "Underweight",
        data: data.map((item) => item.underweight),
        backgroundColor: "#ffa500", // Orange
      },
      {
        label: "Overweight",
        data: data.map((item) => item.overweight),
        backgroundColor: "#4caf50", // Green
      },
      {
        label: "Stunting",
        data: data.map((item) => item.stunting),
        backgroundColor: "#f44336", // Red
      },
      {
        label: "Wasting",
        data: data.map((item) => item.wasting),
        backgroundColor: "#00bcd4", // Cyan
      },
      {
        label: "Severe Wasting",
        data: data.map((item) => item.severe_wasting),
        backgroundColor: "#ff7043", // Orange-Red
      },
    ],
  };
  

  // Bar chart options (fix legend click precision and improve chart size)
  <Bar
    data={pyramidData}
    options={{
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: { size: 14 }, // Larger font
            boxWidth: 20, // Increase box size for clarity
            usePointStyle: true,
            padding: 20, // Add padding between legend items
          },
        },
        tooltip: { mode: "index", intersect: false },
      },
      responsive: true,
      maintainAspectRatio: false, // Allow full control over height
      layout: {
        padding: { top: 10, bottom: 10 },
      },
      scales: {
        x: {
          title: { display: true, text: "Countries", font: { size: 14 } },
          ticks: { font: { size: 10 }, autoSkip: false }, // Prevent ticks skipping
        },
        y: {
          title: { display: true, text: "Percentage", font: { size: 14 } },
          ticks: { font: { size: 12 } },
        },
      },
    }}    
    height={400} // Increase height
  />

  // Top 50 Countries Bar Chart
  const top50Countries = data
    .sort((a, b) => b.stunting - a.stunting)
    .slice(0, 50);
  const topCountriesData = {
    labels: top50Countries.map((item) => item.country),
    datasets: [
      {
        label: "Stunting (%)",
        data: top50Countries.map((item) => item.stunting),
        backgroundColor: "#ffa500",
      },
    ],
  };

  // Scatter Plot: Income vs Malnutrition
  const scatterData = {
    datasets: [
      {
        label: "Income vs Stunting",
        data: data.map((item) => ({
          x: item.income_classification,
          y: item.stunting,
        })),
        backgroundColor: "#ffb703",
      },
    ],
  };
  const calculateSummary = (key) => {
    const values = data.map((item) => item[key] || 0);
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2),
    };
  };
  
  const stackedSummary = calculateSummary("underweight");
  
  return (
    <div className="insights-container">
      {/* Tabs */}
      <div className="tabs">
        {["Population", "Top 50", "Income Correlation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`tab-button ${
              activeTab === tab.toLowerCase() ? "active" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Population Pyramid */}
      {/* Population Pyramid */}
{activeTab === "population" && (
  <>
    {/* Graph Card Container */}
    <div
      className="chart-card"
      style={{
        marginBottom: "20px",
        background: "#062c30",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        width: "95%",
        margin: "0 auto",
      }}
    >
      <h3
        style={{
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "20px",
          color: "#f0e800",
        }}
      >
        Under-5 Population Pyramid (Stacked Vertically)
      </h3>
      <div style={{ height: "500px", width: "100%" }}>
        <Bar
          data={pyramidData}
          options={{
            plugins: { legend: { position: "top" } },
            responsive: true,
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }}
        />
      </div>
    </div>

    {/* Key Insights Section (Outside and Below the Graph Card) */}
<div
  style={{
    backgroundColor: "#004d4d",
    padding: "20px 30px",
    borderRadius: "10px",
    color: "#d4f4f4",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    width: "95%",
    margin: "0 auto 20px",
  }}
>
  <h4
    style={{
      fontSize: "1.4rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#f0e800",
      borderBottom: "2px solid #ffa500",
      paddingBottom: "10px",
    }}
  >
    Key Insights & Analysis
  </h4>
  <p style={{ fontSize: "1rem", lineHeight: "1.8" }}>
    The <strong>Under-5 Stacked Bar Graph</strong> visualizes the distribution of malnutrition categories:
    <span style={{ color: "#ffa500" }}> Underweight</span>,{" "}
    <span style={{ color: "#4caf50" }}>Overweight</span>,{" "}
    <span style={{ color: "#f44336" }}>Stunting</span>,{" "}
    <span style={{ color: "#00bcd4" }}>Wasting</span>, and{" "}
    <span style={{ color: "#ff7043" }}>Severe Wasting</span>. This chart highlights:
  </p>
  <ul style={{ marginTop: "10px", lineHeight: "1.6", paddingLeft: "30px" }}>
    <li>
      <strong style={{ color: "#ffa500" }}>Highest Underweight Rate:</strong>{" "}
      {stackedSummary.max}%.
    </li>
    <li>
      <strong style={{ color: "#4caf50" }}>Lowest Underweight Rate:</strong>{" "}
      {stackedSummary.min}%.
    </li>
    <li>
      <strong style={{ color: "#ff7043" }}>Global Average Underweight:</strong>{" "}
      {stackedSummary.avg}%.
    </li>
    <li>
      <strong style={{ color: "#00bcd4" }}>Observation:</strong> Underweight is prevalent in low-income regions,
      while middle-income areas report higher overweight percentages.
    </li>
  </ul>
</div>

  </>
)}


      {/* Top 50 Countries */}
      {activeTab === "top 50" && (
        <div className="chart-card">
          <h3>Top 50 Countries by Malnutrition (Stunting)</h3>
          <Bar
            data={topCountriesData}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: { mode: "index", intersect: false },
              },
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Countries" } },
                y: { title: { display: true, text: "Stunting (%)" } },
              },
            }}
          />
        </div>
      )}

      {/* Scatter Plot */}
      {activeTab === "income correlation" && (
        <div className="chart-card">
          <h3>Correlation Between Income and Stunting</h3>
          <Scatter
            data={scatterData}
            options={{
              plugins: {
                tooltip: { mode: "nearest", intersect: false },
                legend: { display: true },
              },
              scales: {
                x: {
                  title: { display: true, text: "Income Classification" },
                },
                y: {
                  title: { display: true, text: "Stunting (%)" },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Insights;
