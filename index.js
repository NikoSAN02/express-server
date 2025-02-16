const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.json());

// Webhook to receive events
app.post("/webhook", (req, res) => {
    const eventData = req.body;

    // Validate event data
    if (!eventData || !eventData.event) {
        return res.status(400).send("Invalid event data");
    }

    console.log("📩 Received Event Data:", eventData);

    // Handle DepositReceived event
    if (eventData.event === "DepositReceived") {
        // Validate required fields
        if (!eventData.matchId || !eventData.player || !eventData.offchainId || !eventData.amount) {
            return res.status(400).send("Missing required fields in event data");
        }

        console.log(`✅ Deposit Event - Match ID: ${eventData.matchId}`);
        console.log(`   Player Address: ${eventData.player}`);
        console.log(`   Offchain ID: ${eventData.offchainId}`);
        console.log(`   Amount Deposited: ${eventData.amount}`);

        // Forward event details to Unity (if needed)
        // Example: Call a function to send data to Unity
        // forwardToUnity(eventData);
    }

    // Send success response
    res.status(200).send("Webhook received");
});

// Health check
app.get("/", (req, res) => {
    res.send("Webhook server is running");
});

// Run server
app.listen(3000, () => {
    console.log("🚀 Webhook server running on port 3000");
});