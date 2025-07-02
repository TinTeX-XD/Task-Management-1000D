"use client"

import type React from "react"
import { useState } from "react"
import type { Task } from "@/types"
import { TaskCard } from "./task-card"
import { TaskDrawer } from "./task-drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockTasks } from "@/lib/mock-data"

const columns = [
  { id: "backlog", title: "Backlog", color: "bg-gray-100" },
  { id: "todo", title: "To Do", color: "bg-blue-100" },
  { id: "in-progress", title: "In Progress", color: "bg-yellow-100" },
  { id: "review", title: "Review", color: "bg-purple-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")

    if (taskId && taskId !== draggedTask) return

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: status as Task["status"] } : task)),
    )
    setDraggedTask(null)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setSelectedTask(updatedTask)
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-5 gap-4 h-full">
        {columns.map((column) => (
          <Card key={column.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {getTasksByStatus(column.id).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent
              className="flex-1 space-y-3 min-h-[500px]"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`transition-opacity ${draggedTask === task.id ? "opacity-50" : "opacity-100"}`}
                >
                  <TaskCard task={task} onClick={() => handleTaskClick(task)} />
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full border-2 border-dashed border-gray-300 h-12 text-gray-500 hover:border-gray-400 hover:text-gray-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <TaskDrawer task={selectedTask} open={drawerOpen} onOpenChange={setDrawerOpen} onTaskUpdate={handleTaskUpdate} />
    </div>
  )
}
