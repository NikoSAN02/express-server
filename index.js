const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const eventData = req.body;
    console.log('Received event:', eventData);

    // Check if the event is a Transfer event
    if (eventData.event === 'Transfer') {
        const { from, to, value } = eventData.data;
        const transactionHash = eventData.transactionHash;
        const contractAddress = eventData.contractAddress;

        console.log('Transfer Event Detected:');
        console.log('From:', from);
        console.log('To:', to);
        console.log('Value/Token ID:', value);
        console.log('Transaction Hash:', transactionHash);
        console.log('Contract Address:', contractAddress);

        // Add your custom logic here (e.g., save to database, send notifications, etc.)
    }

    res.status(200).send('Webhook received');
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Webhook server is running');
});

app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
});