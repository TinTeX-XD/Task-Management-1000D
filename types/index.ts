export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface Project {
  id: string
  name: string
  description: string
  client: {
    name: string
    avatar: string
  }
  status: "active" | "completed" | "on-hold" | "planning"
  deadline: string
  gitIntegration: boolean
  progress: number
  teamMembers: User[]
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "backlog" | "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assignee: User
  dueDate: string
  projectId: string
  checklist: ChecklistItem[]
  attachments: Attachment[]
  gitBranch?: string
  whatsappLogs: WhatsAppLog[]
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface WhatsAppLog {
  id: string
  message: string
  timestamp: string
  sender: string
  status: "sent" | "delivered" | "read" | "failed"
}

export interface Client {
  id: string
  name: string
  email: string
  avatar: string
  company: string
  projects: string[]
  createdAt: string
}
