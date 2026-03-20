import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Mock DB (for now)
let devices = [];

// Generate random data (100 records)
function generateData() {
  const statuses = ["active", "fault"];
  for (let i = 1; i <= 100; i++) {
    devices.push({
      deviceId: "D" + i,
      temperature: Math.floor(Math.random() * 80) + 20,
      vibration: Math.floor(Math.random() * 70) + 10,
      status: statuses[Math.floor(Math.random() * 2)],
      timestamp: new Date()
    });
  }
}
generateData();

// 📌 GET devices (pagination + filter)
app.get("/api/devices", (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let filtered = status
    ? devices.filter(d => d.status === status)
    : devices;

  const start = (page - 1) * limit;
  const end = start + Number(limit);

  res.json({
    total: filtered.length,
    data: filtered.slice(start, end)
  });
});

// 📌 Aggregation API
app.get("/api/devices/summary", (req, res) => {
  const total = devices.length;

  const active = devices.filter(d => d.status === "active").length;
  const faults = devices.filter(d => d.status === "fault").length;

  const avgTemp =
    devices.reduce((sum, d) => sum + d.temperature, 0) / total;

  const maxVibration = Math.max(...devices.map(d => d.vibration));

  const uptimePercentage = ((active / total) * 100).toFixed(2);

  res.json({
    avgTemp,
    maxVibration,
    totalFaults: faults,
    uptimePercentage
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
