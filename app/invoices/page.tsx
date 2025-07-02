"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Download, Eye, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

interface Invoice {
  id: string
  invoiceNumber: string
  title: string
  client: {
    name: string
    email: string
    company?: string
  }
  project?: {
    name: string
  }
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
  amount: number
  taxAmount: number
  totalAmount: number
  dueDate: string
  createdAt: string
  items: InvoiceItem[]
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Client {
  id: string
  name: string
  email: string
  company?: string
}

interface Project {
  id: string
  name: string
  clientId: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    title: "Website Development",
    client: {
      name: "John Doe",
      email: "john@example.com",
      company: "Acme Corp",
    },
    project: {
      name: "E-commerce Website",
    },
    status: "SENT",
    amount: 5000,
    taxAmount: 500,
    totalAmount: 5500,
    dueDate: "2024-02-15",
    createdAt: "2024-01-15",
    items: [
      {
        id: "1",
        description: "Frontend Development",
        quantity: 40,
        rate: 100,
        amount: 4000,
      },
      {
        id: "2",
        description: "Backend Integration",
        quantity: 10,
        rate: 100,
        amount: 1000,
      },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    title: "Mobile App Development",
    client: {
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Tech Solutions",
    },
    status: "PAID",
    amount: 8000,
    taxAmount: 800,
    totalAmount: 8800,
    dueDate: "2024-01-30",
    createdAt: "2024-01-01",
    items: [
      {
        id: "3",
        description: "iOS App Development",
        quantity: 60,
        rate: 120,
        amount: 7200,
      },
      {
        id: "4",
        description: "Testing & QA",
        quantity: 10,
        rate: 80,
        amount: 800,
      },
    ],
  },
]

const mockClients: Client[] = [
  { id: "1", name: "John Doe", email: "john@example.com", company: "Acme Corp" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", company: "Tech Solutions" },
]

const mockProjects: Project[] = [
  { id: "1", name: "E-commerce Website", clientId: "1" },
  { id: "2", name: "Mobile App", clientId: "2" },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    projectId: "",
    dueDate: "",
    taxRate: 10,
    items: [{ description: "", quantity: 1, rate: 0 }],
  })

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "SENT":
        return "bg-blue-100 text-blue-800"
      case "PAID":
        return "bg-green-100 text-green-800"
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateInvoice = () => {
    // Calculate amounts
    const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    const taxAmount = subtotal * (formData.taxRate / 100)
    const total = subtotal + taxAmount

    const selectedClient = clients.find((c) => c.id === formData.clientId)
    const selectedProject = projects.find((p) => p.id === formData.projectId)

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      title: formData.title,
      client: selectedClient!,
      project: selectedProject,
      status: "DRAFT",
      amount: subtotal,
      taxAmount,
      totalAmount: total,
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString().split("T")[0],
      items: formData.items.map((item, index) => ({
        id: index.toString(),
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
      })),
    }

    setInvoices([...invoices, newInvoice])
    setIsCreateDialogOpen(false)
    setFormData({
      title: "",
      clientId: "",
      projectId: "",
      dueDate: "",
      taxRate: 10,
      items: [{ description: "", quantity: 1, rate: 0 }],
    })
    toast.success("Invoice created successfully!")
  }

  const addInvoiceItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, rate: 0 }],
    })
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormData({ ...formData, items: updatedItems })
  }

  const removeInvoiceItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: updatedItems })
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    // In a real app, this would generate and download a PDF
    toast.success(`PDF for ${invoice.invoiceNumber} downloaded!`)
  }

  const handleUpdateStatus = (invoiceId: string, newStatus: string) => {
    setInvoices(invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus as any } : inv)))
    toast.success("Invoice status updated!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage and generate invoices for your projects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>Generate a new invoice for your client</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Invoice Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter invoice title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project (Optional)</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects
                        .filter((project) => project.clientId === formData.clientId)
                        .map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Invoice Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Rate</Label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateInvoiceItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Amount</Label>
                      <Input value={`$${(item.quantity * item.rate).toFixed(2)}`} disabled />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInvoiceItem(index)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: Number.parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtotal</Label>
                  <Input
                    value={`$${formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0).toFixed(2)}`}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input
                    value={`$${(formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0) * (1 + formData.taxRate / 100)).toFixed(2)}`}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvoice}>Create Invoice</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>A list of all invoices including their status and amounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.client.name}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadPDF(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Select onValueChange={(value) => handleUpdateStatus(invoice.id, value)}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="SENT">Sent</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="OVERDUE">Overdue</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle>Invoice {selectedInvoice.invoiceNumber}</DialogTitle>
                <DialogDescription>Invoice details and line items</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Bill To:</h3>
                    <div className="space-y-1">
                      <p className="font-medium">{selectedInvoice.client.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedInvoice.client.company}</p>
                      <p className="text-sm text-muted-foreground">{selectedInvoice.client.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Invoice Date: </span>
                        <span>{new Date(selectedInvoice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Due Date: </span>
                        <span>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <Badge className={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h3 className="font-semibold mb-4">Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.rate.toFixed(2)}</TableCell>
                          <TableCell>${item.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Invoice Totals */}
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedInvoice.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedInvoice.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleDownloadPDF(selectedInvoice)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
