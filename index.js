const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store deposit events with timestamps
let depositEvents = [];

// Webhook endpoint for receiving blockchain events
app.post("/webhook", (req, res) => {
    const event = req.body;

    // Validate deposit event structure
    if (
        !event.eventName || 
        event.eventName !== "DepositReceived" ||
        !event.data?.matchId ||
        !event.data?.player
    ) {
        console.log("❌ Rejected non-deposit event:", event);
        return res.status(400).json({ 
            status: "error",
            message: "Invalid deposit event structure"
        });
    }

    // Only store valid deposit events
    const eventData = {
        ...event,
        receivedAt: new Date().toISOString()
    };
    
    depositEvents.unshift(eventData);
    
    // Keep only last 50 events
    if (depositEvents.length > 50) depositEvents = depositEvents.slice(0, 50);
    
    res.status(200).json({ 
        status: "success",
        message: "Deposit event stored"
    });
});

// GET endpoint for Unity to fetch deposit events
app.get("/webhook", (req, res) => {
    console.log("📤 Sending deposit events to Unity. Current event count:", depositEvents.length);
    console.log("Events:", JSON.stringify(depositEvents, null, 2));
    
    res.status(200).json({ 
        status: "success",
        events: depositEvents,
        serverTime: new Date().toISOString()
    });
});

// DELETE endpoint to acknowledge processed events
app.delete("/webhook/:eventId", (req, res) => {
    const eventId = req.params.eventId;
    depositEvents = depositEvents.filter(evt => evt.id !== eventId);
    res.status(200).json({ status: "success" });
});

// Health check endpoint
app.get("/", (req, res) => {
    res.send("✅ Blockchain Game Server Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
