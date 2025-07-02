"use client"

import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Mail, Building, Calendar } from "lucide-react"
import { mockClients, mockProjects } from "@/lib/mock-data"
import { useState } from "react"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getClientProjects = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId)
    if (!client) return []
    return mockProjects.filter((project) => client.projects.includes(project.id))
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">Manage your client relationships and projects</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Client Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjects.filter((p) => p.status === "active").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjects.filter((p) => p.status === "completed").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Projects/Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(mockProjects.length / mockClients.length)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const clientProjects = getClientProjects(client.id)
            const activeProjects = clientProjects.filter((p) => p.status === "active")

            return (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {client.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Client since {new Date(client.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{activeProjects.length}</span>
                      <span className="text-gray-500"> active projects</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{clientProjects.length}</span>
                      <span className="text-gray-500"> total projects</span>
                    </div>
                  </div>

                  {clientProjects.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Projects</h4>
                      <div className="space-y-1">
                        {clientProjects.slice(0, 2).map((project) => (
                          <div key={project.id} className="flex items-center justify-between text-sm">
                            <span className="truncate">{project.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      View Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients found matching your search</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
