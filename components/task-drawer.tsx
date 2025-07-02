"use client"

import { useState } from "react"
import type { Task } from "@/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, GitBranch, MessageSquare, Paperclip, Plus, User, Clock, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskDrawerProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdate: (task: Task) => void
}

export function TaskDrawer({ task, open, onOpenChange, onTaskUpdate }: TaskDrawerProps) {
  const [editMode, setEditMode] = useState(false)

  if (!task) return null

  const handleChecklistToggle = (itemId: string) => {
    const updatedTask = {
      ...task,
      checklist: task.checklist.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    }
    onTaskUpdate(updatedTask)
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  const statusColors = {
    backlog: "bg-gray-100 text-gray-800",
    todo: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    review: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <SheetTitle className="text-xl pr-8">{task.title}</SheetTitle>
              <div className="flex items-center gap-2">
                <Badge className={cn("border", priorityColors[task.priority])}>{task.priority}</Badge>
                <Badge className={statusColors[task.status]}>{task.status.replace("-", " ")}</Badge>
              </div>
            </div>
            <Button variant={editMode ? "default" : "outline"} size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Save" : "Edit"}
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Description
            </h3>
            {editMode ? (
              <Textarea
                value={task.description}
                onChange={(e) => onTaskUpdate({ ...task, description: e.target.value })}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{task.description}</p>
            )}
          </div>

          {/* Assignment & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Assignee</h3>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignee.name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Status</h3>
              {editMode ? (
                <Select
                  value={task.status}
                  onValueChange={(value) => onTaskUpdate({ ...task, status: value as Task["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 rounded-md text-sm capitalize">{task.status.replace("-", " ")}</div>
              )}
            </div>
          </div>

          {/* Due Date & Git Branch */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </h3>
              <div className="p-2 bg-gray-50 rounded-md text-sm">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
            {task.gitBranch && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Git Branch
                </h3>
                <div className="p-2 bg-gray-50 rounded-md text-sm font-mono">{task.gitBranch}</div>
              </div>
            )}
          </div>

          <Separator />

          {/* Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Checkbox className="h-4 w-4" />
                Checklist ({task.checklist.filter((item) => item.completed).length}/{task.checklist.length})
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {task.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox checked={item.completed} onCheckedChange={() => handleChecklistToggle(item.id)} />
                  <span className={`text-sm ${item.completed ? "line-through text-gray-500" : ""}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({task.attachments.length})
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {task.attachments.length === 0 && <p className="text-sm text-gray-500">No attachments</p>}
          </div>

          <Separator />

          {/* WhatsApp Messages */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              WhatsApp Messages ({task.whatsappLogs.length})
            </h3>
            {task.whatsappLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No messages</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {task.whatsappLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-md text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{log.sender}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <p className="mb-2">{log.message}</p>
                    <Badge variant="outline" className="text-xs">
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Send className="h-4 w-4 mr-2" />
              Send WhatsApp Message
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
