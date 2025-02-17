const express = require("express");
const cors = require("cors"); // Import CORS
const bodyParser = require("body-parser");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// Webhook endpoint
app.post("/webhook", (req, res) => {
    console.log("Raw Request Body:", req.body); // Debugging

    const { event, matchId, player, offchainId } = req.body;

    // Validate request data
    if (!event || !matchId || !player || !offchainId) {
        console.error("Missing required fields in event data");
        return res.status(400).json({ error: "Missing required fields in event data" });
    }

    console.log(`✅ Received ${event} Event`);
    console.log(`🔹 Match ID: ${matchId}`);
    console.log(`🔹 Player: ${player}`);
    console.log(`🔹 Offchain ID: ${offchainId}`);

    res.status(200).json({ message: "Webhook received successfully", eventData: req.body });
});

// Health check endpoint
app.get("/", (req, res) => {
    res.send("✅ Webhook server is running!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook server running on port ${PORT}`);
});
