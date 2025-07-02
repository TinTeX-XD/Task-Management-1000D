interface WhatsAppMessage {
  to: string
  text: string
  template?: {
    name: string
    language: string
    components: any[]
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
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || ""
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ""
    this.baseUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}`
  }

  async sendTextMessage(to: string, text: string): Promise<WhatsAppResponse> {
    const url = `${this.baseUrl}/messages`

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: text,
      },
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`WhatsApp API Error: ${error.error?.message || "Unknown error"}`)
    }

    return response.json()
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode = "en",
    components: any[] = [],
  ): Promise<WhatsAppResponse> {
    const url = `${this.baseUrl}/messages`

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components,
      },
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`WhatsApp API Error: ${error.error?.message || "Unknown error"}`)
    }

    return response.json()
  }

  async sendTaskAssignmentNotification(to: string, taskTitle: string, projectName: string, dueDate?: string) {
    const message = `🎯 New Task Assignment\n\nTask: ${taskTitle}\nProject: ${projectName}${dueDate ? `\nDue: ${dueDate}` : ""}\n\nPlease check your dashboard for details.`

    return this.sendTextMessage(to, message)
  }

  async sendProjectUpdateNotification(to: string, projectName: string, updateType: string) {
    const message = `📋 Project Update\n\nProject: ${projectName}\nUpdate: ${updateType}\n\nCheck your dashboard for more details.`

    return this.sendTextMessage(to, message)
  }

  async sendInvoiceReminder(to: string, invoiceNumber: string, amount: string, dueDate: string) {
    const message = `💰 Invoice Reminder\n\nInvoice: ${invoiceNumber}\nAmount: ${amount}\nDue Date: ${dueDate}\n\nPlease process payment at your earliest convenience.`

    return this.sendTextMessage(to, message)
  }

  async sendDeadlineAlert(to: string, taskTitle: string, hoursRemaining: number) {
    const message = `⏰ Deadline Alert\n\nTask: ${taskTitle}\nTime Remaining: ${hoursRemaining} hours\n\nPlease prioritize this task to meet the deadline.`

    return this.sendTextMessage(to, message)
  }
}

export const whatsappService = new WhatsAppService()
