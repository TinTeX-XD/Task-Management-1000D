const axios = require("axios")

// Using Twilio WhatsApp API
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        To: `whatsapp:${phoneNumber}`,
        Body: message,
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    )

    return {
      success: true,
      messageId: response.data.sid,
      status: response.data.status,
    }
  } catch (error) {
    console.error("WhatsApp send error:", error)
    throw new Error("Failed to send WhatsApp message")
  }
}

module.exports = {
  sendWhatsAppMessage,
}
