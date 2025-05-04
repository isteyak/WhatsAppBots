const express = require("express");
const app = express();
const { processMessage } = require("./Appointment");
const doctorRouter = require("./routes/doctors");
const loginRouter = require("./routes/login");
const appointmentApiRouter = require("./routes/AppointmentApi");
const registerRouter = require("./routes/registeruser");
const path = require("path");
const db = require("./db");

//import processMessage from "./Appointment.js";
//import doctorsRouter from "./routes/doctors.js";
require("dotenv").config();

app.use(express.json());

// Routes
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("api/appointments", appointmentApiRouter);
app.use("/api/doctors", doctorRouter);
app.use(express.static(path.join(__dirname, "public")));

// This works for both local development and Vercel
app.get("/", (req, res) => {
  var sn = process.env.DATABASE_URL;
  res.send(
    `Hello World from Node.js server deployed on Vercel! Gap Going Great huh. ${process.env.VERIFY_WHATS_APP_TOKEN}`
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
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];

    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;

      const message = value?.messages?.[0];
      const contact = value?.contacts?.[0];

      const messageType = message?.type;
      let messageText = null;

      // Handle button and text types
      if (messageType === "button") {
        messageText = message?.button?.text;
      } else if (messageType === "text") {
        messageText = message?.text?.body;
      }
      const from = message?.from;
      if (
        message?.type === "interactive" &&
        message.interactive?.type === "list_reply"
      ) {
        const userPhone = message.from;
        const selectedId = message.interactive.list_reply.id; // e.g. "2025-05-03_09:00"
        const [date, time] = selectedId.split("_");

        // 4. Update user state
        await db.query(
          `
          UPDATE user_states
          SET selected_date = $1, selected_time = $2, updated_at = NOW()
          WHERE phone_number = $3
          `,
          [date, time, from]
        );
      }

      const profileName = contact?.profile?.name;
      const waId = contact?.wa_id;

      console.log("👤 Profile Name:", profileName);
      console.log("📞 WhatsApp ID:", waId);
      console.log("📨 Message Type:", messageType);
      console.log("📤 From:", from);
      console.log("📝 Message Text:", messageText);

      // if (messageType === "button") {
      await processMessage(from, messageText);
      // } else {
      // await processInitialMessage(from, messageText);
      //}
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
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
