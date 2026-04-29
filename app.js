// // Import modules
// // const express = require('express');
// const axios = require('axios');

// // Import Express.js
// const express = require('express');

// // Create an Express app
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Set port and verify_token
// const port = process.env.PORT || 3000;
// const verifyToken = process.env.VERIFY_TOKEN;

// // Route for GET requests
// app.get('/', (req, res) => {
//   const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

//   if (mode === 'subscribe' && token === verifyToken) {
//     console.log('WEBHOOK VERIFIED');
//     res.status(200).send(challenge);
//   } else {
//     res.status(403).end();
//   }
// });

// // =========================
// // ✅ POST → Webhook Receive
// // =========================
// const ERPNEXT_API_URL = "https://unheard-ducky-profile.ngrok-free.dev/api/method/rudra_utility.api.update_whatsapp_status";
// app.post('/', async (req, res) => {
//   const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

//   console.log(`\n📩 Webhook received at ${timestamp}`);
//   console.log(JSON.stringify(req.body, null, 2));

//   // ⚡ Always respond fast to Meta
//   res.sendStatus(200);

//   try {
//     const entry = req.body.entry?.[0];
//     const changes = entry?.changes?.[0];
//     const value = changes?.value;

//     // =========================
//     // ✅ Handle STATUS Updates
//     // =========================
//     if (value?.statuses) {
//       for (let statusObj of value.statuses) {

//         const message_id = statusObj.id;
//         const status = statusObj.status;
//         const recipient = statusObj.recipient_id;

//         console.log(`\n📊 Status अपडेट`);
//         console.log(`Message ID: ${message_id}`);
//         console.log(`Status: ${status}`);
//         console.log(`To: ${recipient}`);

//         // 👉 Send to ERPNext
//         await axios.post(ERPNEXT_API_URL, {
//           message_id: message_id,
//           status: status
//         });

//         console.log("✅ ERPNext updated");
//       }
//     }

//   } catch (error) {
//     console.error("❌ Error processing webhook:");
//     console.error(error.response?.data || error.message);
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });



// Import Express.js
const express = require('express');

const axios = require("axios");

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

const ERPNEXT_API_URL = "https://unheard-ducky-profile.ngrok-free.dev/api/method/rudra_utility.api.update_whatsapp_status";
// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.statuses) {
      for (let statusObj of value.statuses) {

        const message_id = statusObj.id;
        const status = statusObj.status;
        const recipient = statusObj.recipient_id;

        console.log(`\n📊 Status अपडेट`);
        console.log(`Message ID: ${message_id}`);
        console.log(`Status: ${status}`);
        console.log(`To: ${recipient}`);

        // 👉 Send to ERPNext
        await axios.post(ERPNEXT_API_URL, {
          message_id: message_id,
          status: status
        });

        console.log("✅ ERPNext updated");
      }
    }

  } catch (error) {
    console.error("❌ Error processing webhook:");
    console.error(error.response?.data || error.message);
  }
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
