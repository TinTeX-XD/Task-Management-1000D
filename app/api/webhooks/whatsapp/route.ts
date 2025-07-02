import { type NextRequest, NextResponse } from "next/server"
import { whatsappService } from "@/lib/whatsapp"

// Webhook verification (GET request)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  // Verify the webhook
  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified successfully")
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse("Forbidden", { status: 403 })
}

// Handle incoming messages (POST request)
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-hub-signature-256")

    // Verify webhook signature
    if (!signature || !whatsappService.verifyWebhook(signature, body)) {
      console.error("Invalid webhook signature")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = JSON.parse(body)

    // Process webhook data
    if (data.object === "whatsapp_business_account") {
      for (const entry of data.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages") {
            const messages = change.value.messages
            const contacts = change.value.contacts

            for (const message of messages || []) {
              await processIncomingMessage(message, contacts)
            }

            // Handle message status updates
            const statuses = change.value.statuses
            for (const status of statuses || []) {
              await processMessageStatus(status)
            }
          }
        }
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

async function processIncomingMessage(message: any, contacts: any[]) {
  try {
    const contact = contacts.find((c) => c.wa_id === message.from)
    const phoneNumber = message.from
    const messageText = message.text?.body || ""
    const messageType = message.type

    console.log(`Received ${messageType} message from ${phoneNumber}: ${messageText}`)

    // Handle different message types
    switch (messageType) {
      case "text":
        await handleTextMessage(phoneNumber, messageText, contact)
        break
      case "image":
        await handleImageMessage(phoneNumber, message.image, contact)
        break
      case "document":
        await handleDocumentMessage(phoneNumber, message.document, contact)
        break
      default:
        console.log(`Unsupported message type: ${messageType}`)
    }

    // Log message to database
    await logIncomingMessage({
      phoneNumber,
      messageType,
      messageText,
      timestamp: new Date(),
      contact: contact?.profile?.name || "Unknown",
    })
  } catch (error) {
    console.error("Error processing incoming message:", error)
  }
}

async function handleTextMessage(phoneNumber: string, messageText: string, contact: any) {
  const lowerText = messageText.toLowerCase().trim()

  // Auto-reply based on keywords
  if (lowerText.includes("help") || lowerText.includes("support")) {
    await whatsappService.sendTextMessage(
      phoneNumber,
      "👋 Hello! I'm your Task Management assistant.\n\nI can help you with:\n• Task updates\n• Project status\n• Invoice information\n\nFor detailed support, please contact your project manager.",
    )
  } else if (lowerText.includes("status") || lowerText.includes("project")) {
    await whatsappService.sendTextMessage(
      phoneNumber,
      "📊 To check your project status, please log in to your dashboard at: " + process.env.NEXT_PUBLIC_APP_URL,
    )
  } else if (lowerText.includes("invoice") || lowerText.includes("payment")) {
    await whatsappService.sendTextMessage(
      phoneNumber,
      "💰 For invoice and payment information, please check your client portal or contact our billing department.",
    )
  } else {
    // Generic response for unrecognized messages
    await whatsappService.sendTextMessage(
      phoneNumber,
      "Thank you for your message. A team member will get back to you soon.\n\nFor immediate assistance, please visit: " +
        process.env.NEXT_PUBLIC_APP_URL,
    )
  }
}

async function handleImageMessage(phoneNumber: string, image: any, contact: any) {
  // Handle image messages (could be task screenshots, etc.)
  await whatsappService.sendTextMessage(
    phoneNumber,
    "📷 Thank you for sharing the image. Our team will review it and get back to you.",
  )
}

async function handleDocumentMessage(phoneNumber: string, document: any, contact: any) {
  // Handle document messages
  await whatsappService.sendTextMessage(
    phoneNumber,
    "📄 Thank you for sharing the document. We'll review it and respond accordingly.",
  )
}

async function processMessageStatus(status: any) {
  try {
    const messageId = status.id
    const statusType = status.status // sent, delivered, read, failed
    const timestamp = new Date(status.timestamp * 1000)

    console.log(`Message ${messageId} status: ${statusType}`)

    // Update message status in database
    await updateMessageStatus({
      messageId,
      status: statusType,
      timestamp,
    })
  } catch (error) {
    console.error("Error processing message status:", error)
  }
}

async function logIncomingMessage(messageData: any) {
  // Log incoming message to database
  // This would typically save to your database
  console.log("Logging incoming message:", messageData)
}

async function updateMessageStatus(statusData: any) {
  // Update message delivery status in database
  // This would typically update your database
  console.log("Updating message status:", statusData)
}
