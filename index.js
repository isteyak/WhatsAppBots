const express = require("express");
const app = express();
const { processMessage } = require("./Appointment");
const doctorsRouter = require("./routes/doctors");

//import processMessage from "./Appointment.js";
//import doctorsRouter from "./routes/doctors.js";
require("dotenv").config();

app.use(express.json());

// Routes
app.use("/api/doctors", doctorsRouter);

// This works for both local development and Vercel
app.get("/", (req, res) => {
  var sn = process.env.DATABASE_URL;
  res.send(
    `Hello World from Node.js server deployed on Vercel! Gap Going Great huh ${process.env.VERIFY_WHATS_APP_TOKEN}`
  );
});

// Webhook Verification (WhatsApp requirement)
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.VERIFY_WHATS_APP_TOKEN) {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});

// WhatsApp Webhook (for incoming messages)
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const message = entry?.changes?.[0]?.value?.messages?.[0];

  console.log(`here is the entry 123 ${entry}`);
  console.log(`here is message 124 ${message}`);
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    console.log(`phone is 126 ${change}`);
    console.log(`message is  125 ${message}`);
  }

  if (message && message.type === "text") {
    const from = message.from; // User's phone number (e.g., "9198xxxxxx")
    const userText = message.text.body; // Actual text message sent
  }

  if (message) {
    const phone = message.from;
    const text = message.text?.body || "";
    console.log(`phone is 126 ${phone}`);
    console.log(`message is  125 ${text}`);
    await processMessage(phone, text);
  }

  res.sendStatus(200);
});

// Export the Express app for Vercel
module.exports = app;

// Start local server if not on Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
