import { type NextRequest, NextResponse } from "next/server"

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified successfully")
    return new NextResponse(challenge)
  } else {
    console.log("WhatsApp webhook verification failed")
    return new NextResponse("Forbidden", { status: 403 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("WhatsApp webhook received:", JSON.stringify(body, null, 2))

    // Process incoming WhatsApp messages
    if (body.object === "whatsapp_business_account") {
      body.entry?.forEach((entry: any) => {
        entry.changes?.forEach((change: any) => {
          if (change.field === "messages") {
            const messages = change.value.messages
            const contacts = change.value.contacts

            messages?.forEach((message: any) => {
              console.log("Received message:", message)

              // Handle different message types
              if (message.type === "text") {
                handleTextMessage(message, contacts)
              } else if (message.type === "button") {
                handleButtonMessage(message, contacts)
              }
            })
          }
        })
      })
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleTextMessage(message: any, contacts: any[]) {
  const from = message.from
  const text = message.text.body
  const contact = contacts.find((c) => c.wa_id === from)

  console.log(`Text message from ${contact?.profile?.name || from}: ${text}`)

  // Here you can implement auto-responses or commands
  // For example, respond to status inquiries, help commands, etc.
}

async function handleButtonMessage(message: any, contacts: any[]) {
  const from = message.from
  const buttonText = message.button.text
  const contact = contacts.find((c) => c.wa_id === from)

  console.log(`Button pressed by ${contact?.profile?.name || from}: ${buttonText}`)

  // Handle button interactions
  // For example, task status updates, project confirmations, etc.
}
