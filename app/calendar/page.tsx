"use client"

import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock } from "lucide-react"
import { mockTasks } from "@/lib/mock-data"
import { useState } from "react"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const tasks = mockTasks.filter((task) => {
    const taskDate = new Date(task.dueDate)
    return taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTasksForDate = (day: number) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.getDate() === day
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">View your tasks and deadlines in calendar format</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((day) => (
                <div key={`empty-${day}`} className="h-24 p-1"></div>
              ))}

              {days.map((day) => {
                const dayTasks = getTasksForDate(day)
                const isToday =
                  new Date().toDateString() ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                return (
                  <div
                    key={day}
                    className={`h-24 p-1 border rounded-lg ${isToday ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}
                  >
                    <div className="text-sm font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div key={task.id} className="text-xs p-1 rounded truncate bg-white border">
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${priorityColors[task.priority].split(" ")[0]}`}
                            ></div>
                            <span className="truncate">{task.title}</span>
                          </div>
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">+{dayTasks.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter((task) => {
                  const taskDate = new Date(task.dueDate)
                  const today = new Date()
                  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                  return taskDate >= today && taskDate <= nextWeek
                })
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
