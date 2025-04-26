const {
  sendWhatsAppMessage,
  sendFinalConfirmationWhatsAppMessage,
  sendAppionmentWhatsAppMessage,
  sendSelectionDateWhatsAppMessage,
  sendInvalidWhatsAppMessage,
} = require("./SendMessages");
const { parseDate } = require("./ParseDate");
const db = require("./db");
//import { sendWhatsAppMessage } from "./SendMessages";
//import { parseDate } from "./ParseDate";

// Process incoming messages
async function processMessage(phone, text) {
  const user = await getUserState(phone);
  console.log(text);
  console.log(phone);

  switch (user.current_state) {
    case "INITIAL":
      return handleInitialState(phone);
    case "DATE_SELECTION":
      return handleDateSelection(phone, text);
    case "CONFIRMATION":
      return handleConfirmation(phone, text);
    default:
      return handleInitialState(phone);
  }
}
module.exports = { processMessage };

async function handleDateSelection(phone, text) {
  const user = await getUserState(phone);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  console.log("Today:", todayStr); // e.g., "2025-04-26"
  console.log("Tomorrow:", tomorrowStr); // e.g., "2025-04-27"

  if (!today) {
    return sendWhatsAppMessage(phone, "❌ Invalid date. Use DD/MM format.");
  }

  // Check doctor availability
  //const slots = await getAvailableTimeSlots(user.selected_doctor_id, date);

  await db.query(
    "UPDATE user_states SET current_state = $1, selected_date = $2 WHERE phone_number = $3",
    ["CONFIRMATION", today, phone]
  );
  const reply = "date selection happening";
  await sendSelectionDateWhatsAppMessage(phone, reply);
}

async function handleConfirmation(phone, text) {
  //const date = parseDate(text); // DD/MM → Date object
  const user = await getUserState(phone);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  console.log("Today:", todayStr); // e.g., "2025-04-26"
  console.log("Tomorrow:", tomorrowStr); // e.g., "2025-04-27"
  const currentTime = now.toTimeString().split(" ")[0];

  if (!today) {
    return sendWhatsAppMessage(phone, "❌ Invalid date. Use DD/MM format.");
  }

  // Check doctor availability
  //const slots = await getAvailableTimeSlots(user.selected_doctor_id, date);

  await db.query(
    "UPDATE user_states SET current_state = $1, selected_date = $2 WHERE phone_number = $3",
    ["CONFIRMED", today, phone]
  );
  await db.query(
    `INSERT INTO public.patients (phone, created_at) 
   VALUES ($1, $2) 
   ON CONFLICT (phone) 
   DO UPDATE SET created_at = EXCLUDED.created_at`,
    [phone, today]
  );
  const patient = await db.query(
    "SELECT * FROM public.patients WHERE phone = $1",
    [phone]
  );

  const p = patient.rows[0];

  await db.query(
    `INSERT INTO public.appointments 
      (doctor_id, patient_id, date, time, status, payment_status, reminder_sent) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (patient_id) 
     DO UPDATE SET 
       doctor_id = EXCLUDED.doctor_id,
       date = EXCLUDED.date,
       time = EXCLUDED.time
       status = EXCLUDED.status,
       payment_status = EXCLUDED.payment_status,
       reminder_sent = EXCLUDED.reminder_sent`,
    [1, p.id, today, currentTime, "confirm", "pending", false]
  );

  const reply = "Confirmation is happening";
  await sendFinalConfirmationWhatsAppMessage(phone, reply);
}

/**
 * Gets or creates a user's conversation state
 * @param {string} phone - User's WhatsApp phone number
 * @returns {Promise<Object>} User state object
 */
async function getUserState(phone) {
  try {
    // Try to fetch existing state
    const result = await db.query(
      "SELECT * FROM user_states WHERE phone_number = $1",
      [phone]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new state if doesn't exist
    const newState = {
      phone_number: phone,
      current_state: "INITIAL",
      state_data: {},
    };

    await db.query(
      `INSERT INTO user_states 
       (phone_number, current_state, state_data) 
       VALUES ($1, $2, $3)`,
      [phone, newState.current_state, newState.state_data]
    );

    return newState;
  } catch (error) {
    console.error("Error getting user state:", error);
    throw error;
  }
}

async function handleInitialState(phone) {
  try {
    const doctors = await db.query(
      "SELECT id, name, specialty FROM doctors WHERE id = 1"
    );

    let reply = "🏥 *Welcome to DoctorApp!* 🏥\n\n";
    reply += "Please choose a doctor:\n\n";

    doctors.rows.forEach((doctor, index) => {
      reply += `${index + 1}. Dr. ${doctor.name} (${doctor.specialty})\n`;
    });

    // Update user state
    await db.query(
      `INSERT INTO user_states (phone_number, current_state) 
       VALUES ($1, 'DATE_SELECTION')
       ON CONFLICT (phone_number) 
       DO UPDATE SET current_state = 'DATE_SELECTION', updated_at = NOW()`,
      [phone]
    );

    await sendAppionmentWhatsAppMessage(phone, reply);
  } catch (error) {
    console.error("Error in handleInitialState:", error);
    await sendInvalidWhatsAppMessage(
      phone,
      "⚠️ We're experiencing technical difficulties. Please try again later."
    );
  }
}
