const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid"); // Add uuid package for generating unique IDs

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store deposit events with timestamps
let depositEvents = [];

// Webhook endpoint for receiving blockchain events
app.post("/webhook", (req, res) => {
    const event = req.body;
    console.log("📥 Received webhook event:", JSON.stringify(event, null, 2));
    
    // Validate deposit event structure
    if (
        !event.eventName || 
        event.eventName !== "DepositReceived" ||
        !event.data?.matchId ||
        !event.data?.player ||
        !event.data?.offchainId // Ensure offchainId is present
    ) {
        console.log("❌ Rejected invalid event:", JSON.stringify(event, null, 2));
        return res.status(400).json({ 
            status: "error",
            message: "Invalid deposit event structure"
        });
    }
    
    // Add unique ID and format correctly for Unity
    const eventData = {
        id: uuidv4(),
        eventName: event.eventName,
        data: {
            matchId: event.data.matchId,
            player: event.data.player,
            offchainId: event.data.offchainId
        },
        transaction: event.transaction || {
            transactionHash: event.transactionHash || "unknown",
            blockNumber: event.blockNumber || "unknown"
        },
        receivedAt: new Date().toISOString()
    };
    
    console.log("✅ Storing valid deposit event:", JSON.stringify(eventData, null, 2));
    depositEvents.unshift(eventData);
    
    // Keep only last 50 events
    if (depositEvents.length > 50) {
        depositEvents = depositEvents.slice(0, 50);
    }
    
    res.status(200).json({ 
        status: "success",
        message: "Deposit event stored",
        eventId: eventData.id
    });
});

// GET endpoint for Unity to fetch deposit events
app.get("/webhook", (req, res) => {
    console.log("📤 Sending deposit events to Unity. Current event count:", depositEvents.length);
    
    if (depositEvents.length > 0) {
        console.log("First event example:", JSON.stringify(depositEvents[0], null, 2));
    }
    
    res.status(200).json({ 
        status: "success",
        events: depositEvents,
        serverTime: new Date().toISOString()
    });
});

// DELETE endpoint to acknowledge processed events
app.delete("/webhook/:eventId", (req, res) => {
    const eventId = req.params.eventId;
    console.log(`🗑️ Removing processed event: ${eventId}`);
    
    const previousCount = depositEvents.length;
    depositEvents = depositEvents.filter(evt => evt.id !== eventId);
    
    if (previousCount === depositEvents.length) {
        console.log(`⚠️ Event ${eventId} not found or already removed`);
    } else {
        console.log(`✅ Successfully removed event ${eventId}`);
    }
    
    res.status(200).json({ 
        status: "success",
        message: "Event acknowledged and removed",
        remainingEvents: depositEvents.length
    });
});

// Health check endpoint
app.get("/", (req, res) => {
    res.send(`✅ Blockchain Game Server Running - Managing ${depositEvents.length} events`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📌 Webhook endpoint: http://localhost:${PORT}/webhook`);
});
