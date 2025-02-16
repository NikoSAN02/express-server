const express = require("express");
const cors = require("cors"); // Enable CORS
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Replace bodyParser.json()

// Webhook Endpoint
app.post("/webhook", (req, res) => {
  console.log("🔹 Received Event Data:", req.body);
  console.log("🔹 Headers:", req.headers);

  res.status(200).json({ message: "Webhook received successfully" });
});

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("✅ Webhook server is running");
});

// Start Server (For Local Testing Only)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port ${PORT}"));