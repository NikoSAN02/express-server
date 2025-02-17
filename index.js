const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Store events in memory (optional)
let recentEvents = [];

// Webhook `POST` endpoint (for blockchain event)
app.post("/webhook", (req, res) => {
    console.log("Received Webhook Request:", req.body);

    const { event, matchId, player, offchainId } = req.body;
    if (!event || !matchId || !player || !offchainId) {
        return res.status(400).json({ error: "Missing required fields in event data" });
    }

    // Store event (for testing `GET` request)
    recentEvents.push(req.body);
    if (recentEvents.length > 10) recentEvents.shift(); // Keep the last 10 events

    console.log(`✅ Received ${event} Event | Match: ${matchId} | Player: ${player}`);
    res.status(200).json({ message: "Webhook received successfully", eventData: req.body });
});

// ✅ NEW: Add a `GET` route for Unity to fetch data
app.get("/webhook", (req, res) => {
    res.status(200).json({ recentEvents });
});

// Health check
app.get("/", (req, res) => {
    res.send("✅ Webhook server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook server running on port ${PORT}`);
});
