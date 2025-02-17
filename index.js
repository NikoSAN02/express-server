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
    const eventData = {
        ...req.body,
        receivedAt: new Date().toISOString()
    };
    
    console.log("📥 Received blockchain event:", JSON.stringify(eventData, null, 2));
    
    blockchainEvents.unshift(eventData);
    
    // Keep only last 50 events
    if (blockchainEvents.length > 50) {
        blockchainEvents = blockchainEvents.slice(0, 50);
    }
    
    res.status(200).json({ 
        status: "success",
        message: "Event received",
        data: eventData 
    });
});

// GET endpoint for Unity to fetch events
app.get("/webhook", (req, res) => {
    console.log("📤 Sending events to Unity. Current event count:", blockchainEvents.length);
    console.log("Events:", JSON.stringify(blockchainEvents, null, 2));
    
    res.status(200).json({ 
        status: "success",
        events: blockchainEvents,
        serverTime: new Date().toISOString()
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
