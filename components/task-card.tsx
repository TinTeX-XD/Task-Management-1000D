"use client"

import type { Task } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageSquare, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  const isOverdue = new Date(task.dueDate) < new Date()

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={onClick}>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
          <div className="flex items-center justify-between">
            <Badge className={cn("text-xs border", priorityColors[task.priority])}>{task.priority}</Badge>
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className={cn("flex items-center gap-1", isOverdue && "text-red-500")}>
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            {task.gitBranch && <GitBranch className="h-3 w-3" />}
            {task.whatsappLogs.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {task.whatsappLogs.length}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
