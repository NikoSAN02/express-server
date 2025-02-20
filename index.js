const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store blockchain events
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

// GET endpoint for Unity to fetch only "DepositReceived" events
app.get("/webhook", (req, res) => {
    const depositEvents = blockchainEvents.filter(event => event.event === "DepositReceived");

    console.log("📤 Sending ONLY deposit events to Unity. Count:", depositEvents.length);
    
    res.status(200).json({ 
        status: "success",
        events: depositEvents,
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
