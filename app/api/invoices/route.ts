import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)

    // Mock data for now - replace with actual database queries
    const invoices = [
      {
        id: "1",
        invoiceNumber: "INV-001",
        clientName: "Acme Corp",
        projectName: "Website Redesign",
        amount: 5000,
        status: "sent",
        dueDate: "2024-02-15",
        createdAt: "2024-01-15",
        items: [
          { id: "1", description: "UI/UX Design", quantity: 40, rate: 75, amount: 3000 },
          { id: "2", description: "Frontend Development", quantity: 20, rate: 100, amount: 2000 },
        ],
      },
      {
        id: "2",
        invoiceNumber: "INV-002",
        clientName: "Tech Solutions",
        projectName: "Mobile App",
        amount: 8000,
        status: "paid",
        dueDate: "2024-01-30",
        createdAt: "2024-01-01",
        items: [{ id: "3", description: "Mobile App Development", quantity: 80, rate: 100, amount: 8000 }],
      },
    ]

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const body = await request.json()

    // Here you would create the invoice in your database
    // For now, we'll just return a success response

    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: "draft",
    }

    return NextResponse.json({ invoice: newInvoice }, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
