interface WhatsAppMessage {
  messaging_product: "whatsapp"
  to: string
  type: "text" | "template"
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: Array<{
      type: string
      parameters: Array<{
        type: string
        text: string
      }>
    }>
  }
}

interface WhatsAppResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

class WhatsAppService {
  private accessToken: string
  private phoneNumberId: string
  private baseUrl: string

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!
    this.baseUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`

    if (!this.accessToken || !this.phoneNumberId) {
      throw new Error("WhatsApp credentials are not configured")
    }
  }

  async sendTextMessage(to: string, message: string): Promise<WhatsAppResponse> {
    const payload: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""), // Remove non-digits
      type: "text",
      text: {
        body: message,
      },
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`WhatsApp API Error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
      throw error
    }
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode = "en",
    parameters: string[] = [],
  ): Promise<WhatsAppResponse> {
    const payload: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components:
          parameters.length > 0
            ? [
                {
                  type: "body",
                  parameters: parameters.map((param) => ({
                    type: "text",
                    text: param,
                  })),
                },
              ]
            : undefined,
      },
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`WhatsApp API Error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error sending WhatsApp template message:", error)
      throw error
    }
  }

  // Notification methods for different events
  async notifyTaskAssignment(phoneNumber: string, taskTitle: string, assigneeName: string, projectName: string) {
    const message = `🎯 New Task Assignment\n\nHi ${assigneeName}!\n\nYou've been assigned a new task:\n"${taskTitle}"\n\nProject: ${projectName}\n\nPlease check your dashboard for more details.`
    return this.sendTextMessage(phoneNumber, message)
  }

  async notifyTaskStatusUpdate(
    phoneNumber: string,
    taskTitle: string,
    oldStatus: string,
    newStatus: string,
    updatedBy: string,
  ) {
    const message = `📋 Task Status Update\n\nTask: "${taskTitle}"\nStatus: ${oldStatus} → ${newStatus}\nUpdated by: ${updatedBy}\n\nCheck your dashboard for details.`
    return this.sendTextMessage(phoneNumber, message)
  }

  async notifyProjectDeadline(phoneNumber: string, projectName: string, daysLeft: number) {
    const message = `⏰ Project Deadline Reminder\n\nProject: ${projectName}\nDeadline: ${daysLeft} days remaining\n\nPlease ensure all tasks are completed on time.`
    return this.sendTextMessage(phoneNumber, message)
  }

  async notifyInvoiceGenerated(phoneNumber: string, invoiceNumber: string, clientName: string, amount: string) {
    const message = `💰 Invoice Generated\n\nInvoice #${invoiceNumber}\nClient: ${clientName}\nAmount: ${amount}\n\nThe invoice has been sent to the client.`
    return this.sendTextMessage(phoneNumber, message)
  }

  async notifyInvoicePayment(phoneNumber: string, invoiceNumber: string, amount: string, clientName: string) {
    const message = `✅ Payment Received\n\nInvoice #${invoiceNumber}\nClient: ${clientName}\nAmount: ${amount}\n\nPayment has been successfully processed.`
    return this.sendTextMessage(phoneNumber, message)
  }

  // Verify webhook signature
  verifyWebhook(signature: string, body: string): boolean {
    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN!)
      .update(body)
      .digest("hex")

    return signature === `sha256=${expectedSignature}`
  }
}

export const whatsappService = new WhatsAppService()
export default whatsappService
