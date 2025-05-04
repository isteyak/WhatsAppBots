const axios = require("axios");

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendInvalidWhatsAppMessage(
  phone,
  message,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: "Hi! What’s your name?",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendAppionmentWhatsAppMessage(
  phone,
  message,
  drName,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }

    const pathstr = `${process.env.APPLICATIONURL}/Images/AmirHospital.jpg`;

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "appointment_message",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: pathstr,
                  },
                },
              ],
            },
            // Add body parameters if your template expects them
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendSelectionDateWhatsAppMessage(
  phone,
  message,
  dynamo,
  today,
  tommorrow,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "select_date",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", parameter_name: "dynamo", text: dynamo },
                { type: "text", parameter_name: "today", text: today },
                { type: "text", parameter_name: "tomorrow", text: tommorrow },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendThanksForConfirmationWhatsAppMessage(
  phone,
  patientname,
  patientAge,
  date,
  time,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }
    const pathstr = `${process.env.APPLICATIONURL}/Images/Confirmation.png`;
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone, // must be in international format e.g. "919812345678"
        type: "template",
        template: {
          name: "confirmed_message", // make sure this matches EXACTLY
          language: {
            code: "en", // or "en_US" depending on how the template was created
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: pathstr,
                  },
                },
              ],
              type: "body",
              parameters: [
                { type: "text", text: patientname },
                { type: "text", text: patientage },
                { type: "text", text: date },
                { type: "text", text: time },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendFinalConfirmationWhatsAppMessage(
  phone,
  message,
  patientname,
  patientage,
  date,
  time,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }
    const pathstr = `${process.env.APPLICATIONURL}/Images/AmirHospital.jpg`;

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "confirm_appoinment",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: pathstr,
                  },
                },
              ],
              type: "body",
              parameters: [
                { type: "text", text: patientname },
                { type: "text", text: patientage },
                { type: "text", text: date },
                { type: "text", text: time },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function invalid_selection(phone, message, messageType = "text") {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "invalid_selection",
          language: {
            code: "en_US",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendErrorWhatsAppMessage(phone, message, messageType = "text") {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "invalid_selection",
          language: {
            code: "en_US",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendEnterNameWhatsAppMessage(
  phone,
  message,
  Name,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }
    const pathstr = `${process.env.APPLICATIONURL}/Images/AmirHospitalLogo.png`;
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "ask_name",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: pathstr,
                  },
                },
              ],
              type: "body",
              parameters: [
                { type: "text", parameter_name: "name", text: Name },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    throw error;
  }
}

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendEnterAgeWhatsAppMessage(
  phone,
  message,
  patientname,
  messageType = "text"
) {
  try {
    if (messageType !== "text") {
      throw new Error("Currently, only 'text' messages are supported.");
    }
    const pathstr = `${process.env.APPLICATIONURL}/Images/AmirHospitalLogo.png`;
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "ask_age",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: pathstr,
                  },
                },
              ],
              type: "body",
              parameters: [
                {
                  type: "text",
                  parameter_name: "patient_name",
                  text: patientname,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );

    throw error;
  }
}

async function sendWhatsAppSlotList(
  to,
  availableSlots,
  patientName,
  patientAge
) {
  const sections = Object.entries(availableSlots).map(([date, slots]) => ({
    title: `Available on ${date}`,
    rows: slots.map((slot) => ({
      id: `${date}_${slot}`,
      title: slot,
      description: `Slot on ${date} at ${slot}`,
    })),
  }));

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to, // WhatsApp number
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Available Appointment Slots",
      },
      body: {
        text: `Hello ${patientName}, age ${patientAge} 👋\n\nYou're booking an appointment at Dr. Amir Hospital.\n\nPlease select one of the available time slots below.`,
      },
      footer: {
        text: "Tap 'Choose Slot' to view options.",
      },
      action: {
        button: "Choose Slot",
        sections: sections,
      },
    },
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Failed to send WhatsApp message:",
      error.response?.data || error.message
    );
  }
}

module.exports = {
  sendAppionmentWhatsAppMessage,
  sendSelectionDateWhatsAppMessage,
  sendFinalConfirmationWhatsAppMessage,
  sendInvalidWhatsAppMessage,
  sendErrorWhatsAppMessage,
  sendThanksForConfirmationWhatsAppMessage,
  sendEnterNameWhatsAppMessage,
  sendEnterAgeWhatsAppMessage,
  sendWhatsAppSlotList,
};
