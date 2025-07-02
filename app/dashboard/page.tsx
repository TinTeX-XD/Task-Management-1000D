"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle2, Clock, FolderOpen, Plus } from "lucide-react"

interface Project {
  id: number
  name: string
  status: string
  completion_percentage: number
  total_tasks: number
  completed_tasks: number
  deadline: string
}

interface DashboardStats {
  total_projects: number
  active_projects: number
  total_tasks: number
  completed_tasks: number
  overdue_tasks: number
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const projectsData = await projectsRes.json()
      setProjects(projectsData.projects || [])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "planning":
        return "bg-blue-500"
      case "on_hold":
        return "bg-yellow-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const canCreateProject = user?.role === "admin" || user?.role === "project_manager"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
        </div>

        {canCreateProject && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_projects}</div>
              <p className="text-xs text-muted-foreground">{stats.active_projects} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_tasks}</div>
              <p className="text-xs text-muted-foreground">{stats.completed_tasks} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_tasks > 0 ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue_tasks}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Your most recently updated projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-600">
                      {project.total_tasks} tasks • Due {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{project.completion_percentage}% Complete</div>
                    <Progress value={project.completion_percentage} className="w-24" />
                  </div>

                  <Badge variant="outline" className="capitalize">
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
