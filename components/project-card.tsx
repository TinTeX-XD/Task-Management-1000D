"use client"

import type { Project } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, GitBranch, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    "on-hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    planning: "bg-purple-100 text-purple-800 border-purple-200",
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
          {project.gitIntegration && <GitBranch className="h-4 w-4 text-gray-500" />}
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.client.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">{project.client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{project.client.name}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs border", statusColors[project.status])}>
            {project.status.replace("-", " ")}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            {new Date(project.deadline).toLocaleDateString()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="h-3 w-3" />
            {project.teamMembers.length} members
          </div>
          <div className="flex -space-x-1">
            {project.teamMembers.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
