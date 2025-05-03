const {
  sendFinalConfirmationWhatsAppMessage,
  sendAppionmentWhatsAppMessage,
  sendSelectionDateWhatsAppMessage,
  sendInvalidWhatsAppMessage,
  sendErrorWhatsAppMessage,
  sendThanksForConfirmationWhatsAppMessage,
  sendEnterNameWhatsAppMessage,
  sendEnterAgeWhatsAppMessage,
  sendWhatsAppSlotList,
} = require("./SendMessages");
const { parseDate } = require("./ParseDate");
const db = require("./db");

// Process incoming messages
async function processMessage(phone, text) {
  const user = await getUserState(phone);

  switch (user.current_state) {
    case "INITIAL":
      return handleInitialState(phone);
    case "BOOK_APPOINMENT":
      return handleBookAppoinmnet(phone);
    case "ASK_NAME":
      return handleAskName(phone, text);
    case "ASK_AGE":
      return handleAskAge(phone, text);
    case "DATE_SELECTION":
      return handleDateSelection(phone, text);
    case "CONFIRMATION":
      return handleConfirmation(phone, text);

    default:
      return handleInitialState(phone);
  }
}
async function handleBookAppoinmnet(phone) {
  await db.query(
    "UPDATE user_states SET current_state = $1 WHERE phone_number = $2",
    ["ASK_NAME", phone]
  );
  await sendEnterNameWhatsAppMessage(phone, "enter name", "Amir patel");
}
async function handleAskAge(phone, text) {
  const user = await getUserState(phone);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  console.log("Today:", todayStr); // e.g., "2025-04-26"
  console.log("Tomorrow:", tomorrowStr); // e.g., "2025-04-27"

  const dates = getNextValidDates(); // e.g., ['2025-05-03', '2025-05-05']
  const slots = await getAvailableSlotsForDates(1, dates);
  console.log(slots);

  const limitedSlots = Object.fromEntries(
    Object.entries(slots).map(([date, slotList]) => [
      date,
      slotList.slice(0, 3), // only first 3 slots
    ])
  );

  await db.query(
    "UPDATE user_states SET current_state = $1 WHERE phone_number = $2",
    ["DATE_SELECTION", phone]
  );
  await db.query(
    `INSERT INTO patients (phone, age) 
     VALUES ($1, $2) 
     ON CONFLICT (phone) DO UPDATE SET age = EXCLUDED.age`,
    [phone, text]
  );
  await sendWhatsAppSlotList(phone, limitedSlots);
}

async function handleAskName(phone, text) {
  await db.query(
    "UPDATE user_states SET current_state = $1 WHERE phone_number = $2",
    ["ASK_AGE", phone]
  );
  await db.query(
    `INSERT INTO patients (phone, name) 
     VALUES ($1, $2) 
     ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name`,
    [phone, text]
  );
  await sendEnterAgeWhatsAppMessage(phone, text, "under 18yr");
}

module.exports = { processMessage };

async function handleDateSelection(phone, text) {
  const user = await getUserState(phone);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formatDate = (date) => date.toISOString().split("T")[0];
  const formatTime = (date) => date.toISOString().split("T")[1].split(".")[0]; // "HH:MM:SS"
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);
  const currentTime = formatTime(today);
  console.log("Today:", todayStr); // e.g., "2025-04-26"
  console.log("Tomorrow:", tomorrowStr); // e.g., "2025-04-27"

  if (!today) {
    return sendAppionmentWhatsAppMessage(
      phone,
      "❌ Invalid date. Use DD/MM format.",
      "Amir"
    );
  }

  // Check doctor availability
  //const slots = await getAvailableTimeSlots(user.selected_doctor_id, date);
  await db.query(
    "UPDATE user_states SET current_state = $1, selected_date = $2 WHERE phone_number = $3",
    ["CONFIRMATION", today, phone]
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
       time = EXCLUDED.time,
       status = EXCLUDED.status,
       payment_status = EXCLUDED.payment_status,
       reminder_sent = EXCLUDED.reminder_sent`,
    [1, p.id, todayStr, currentTime, "confirmed", "pending", false]
  );

  const reply =
    "Confirmation is happening and patient name is " +
    p.name +
    " And age is" +
    p.age +
    " date is " +
    todayStr;
  await sendFinalConfirmationWhatsAppMessage(phone, reply, reply);
}

async function handleConfirmation(phone, text) {
  //const date = parseDate(text); // DD/MM → Date object
  const user = await getUserState(phone);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const formatTime = (date) => date.toISOString().split("T")[1].split(".")[0]; // "HH:MM:SS"

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);
  const currentTime = formatTime(today);

  console.log("Today:", todayStr); // e.g., "2025-04-26"
  console.log("Tomorrow:", tomorrowStr); // e.g., "2025-04-27"

  if (!today) {
    return sendInvalidWhatsAppMessage(
      phone,
      "❌ Invalid date. Use DD/MM format."
    );
  }

  // Check doctor availability
  //const slots = await getAvailableTimeSlots(user.selected_doctor_id, date);

  await db.query(
    "UPDATE user_states SET current_state = $1, selected_date = $2 WHERE phone_number = $3",
    ["CONFIRMED", today, phone]
  );

  await sendThanksForConfirmationWhatsAppMessage(phone, todayStr);
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

    await db.query(
      "UPDATE user_states SET current_state = $1 WHERE phone_number = $2",
      ["BOOK_APPOINMENT", phone]
    );

    await sendAppionmentWhatsAppMessage(phone, reply, "amir");
  } catch (error) {
    console.error("Error in handleInitialState:", error);
    await sendInvalidWhatsAppMessage(
      phone,
      "⚠️ We're experiencing technical difficulties. Please try again later."
    );
  }
}

function getNextValidDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const result = [];

  // Helper to clone date and add days
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  // Skip today if it's Sunday
  if (dayOfWeek !== 0) result.push(today);

  // Determine tomorrow or Monday
  let tomorrow = addDays(today, 1);
  if (tomorrow.getDay() === 0) {
    // If tomorrow is Sunday, use Monday instead
    tomorrow = addDays(tomorrow, 1);
  }

  result.push(tomorrow);
  return result.map((d) => d.toISOString().slice(0, 10)); // Format as 'YYYY-MM-DD'
}

async function getAvailableSlotsForDates(doctorId, dates) {
  const allSlots = {};

  for (const date of dates) {
    const query = `
    WITH RECURSIVE time_slots AS (
      SELECT 
        d.working_hours_start AS slot,
        d.working_hours_end AS end_time
      FROM doctors d
      WHERE d.id = $1
  
      UNION ALL
  
      SELECT 
        slot + INTERVAL '15 minutes',
        end_time
      FROM time_slots
      WHERE slot + INTERVAL '15 minutes' < end_time
    )
    SELECT to_char(slot, 'HH24:MI') AS slot
    FROM time_slots
    WHERE slot NOT IN (
      SELECT time
      FROM appointments
      WHERE doctor_id = $1
        AND date = $2
        AND status = 'confirmed'
    )
    ORDER BY slot;
  `;

    const values = [doctorId, date];

    try {
      const result = await db.query(query, values);
      allSlots[date] = result.rows.map((row) => row.slot);
    } catch (err) {
      console.error(`Error fetching slots for ${date}:`, err);
      allSlots[date] = [];
    }
  }

  return allSlots;
}
