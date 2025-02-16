const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const eventData = req.body;
  console.log("Received Event Data:", eventData);
  // Send notification to your app
  res.status(200).send("Webhook received");
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Webhook server is running');
});

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});