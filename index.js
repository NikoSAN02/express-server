const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store events with timestamps
let blockchainEvents = [];

// Webhook endpoint for receiving blockchain events
app.post("/webhook", (req, res) => {
    console.log("📥 Received Blockchain Event:", req.body);
    
    const eventData = {
        ...req.body,
        timestamp: Date.now()
    };
    
    // Add new event to the beginning of the array
    blockchainEvents.unshift(eventData);
    
    // Keep only last 100 events
    if (blockchainEvents.length > 100) {
        blockchainEvents = blockchainEvents.slice(0, 100);
    }
    
    // Log specific events
    if (eventData.event === "DepositReceived") {
        console.log(`✅ Deposit Received | Match: ${eventData.matchId} | Player: ${eventData.player}`);
    } else if (eventData.event === "MatchStarted") {
        console.log(`🎮 Match Started | Match: ${eventData.matchId}`);
    }
    
    res.status(200).json({ 
        message: "Event processed successfully", 
        eventData 
    });
});

// GET endpoint for Unity to fetch events
app.get("/webhook", (req, res) => {
    // Get the timestamp from query params (if provided)
    const lastTimestamp = req.query.since ? parseInt(req.query.since) : 0;
    
    // Filter events newer than the timestamp
    const newEvents = blockchainEvents.filter(event => event.timestamp > lastTimestamp);
    
    res.status(200).json({ 
        events: newEvents,
        serverTime: Date.now()
    });
});

// Health check endpoint
app.get("/", (req, res) => {
    res.send("✅ Blockchain Game Server Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
