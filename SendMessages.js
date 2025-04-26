const axios = require("axios");

/**
 * Sends a WhatsApp message to a user
 * @param {string} phone - Recipient phone number (with country code, e.g., "911234567890")
 * @param {string} message - Text message to send
 * @param {string} [messageType="text"] - Type of message (text, image, etc.)
 */
async function sendWhatsAppMessage(phone, message, messageType = "text") {
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
          name: "appointment",
          language: {
            code: "en",
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
async function sendAppionmentWhatsAppMessage(
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
        type: "template",
        template: {
          name: "appointment",
          language: {
            code: "en",
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
async function sendSelectionDateWhatsAppMessage(
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
        type: "template",
        template: {
          name: "select_date",
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
async function sendThanksForConfirmationWhatsAppMessage(
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
        type: "template",
        template: {
          name: "confirmed_message",
          language: {
            code: "en",
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
async function sendFinalConfirmationWhatsAppMessage(
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
        type: "template",
        template: {
          name: "confirm_appoinment",
          language: {
            code: "en",
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

    // console.error(
    //   "❌ Error sending message:",
    //   error.response?.data || error.message
    // );
    throw error;
  }
}

module.exports = {
  sendAppionmentWhatsAppMessage,
  sendWhatsAppMessage,
  sendSelectionDateWhatsAppMessage,
  sendFinalConfirmationWhatsAppMessage,
  sendInvalidWhatsAppMessage,
  sendThanksForConfirmationWhatsAppMessage,
};
