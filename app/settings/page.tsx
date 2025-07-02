"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { LocalStorage } from "@/lib/local-storage"
import { User, Bell, Shield, Palette, Database, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState(LocalStorage.getTheme())
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    whatsapp: true,
    taskUpdates: true,
    projectDeadlines: true,
    teamMentions: false,
  })

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    LocalStorage.setTheme(newTheme)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="e.g. Project Manager, Developer" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" />
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive browser push notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via WhatsApp</p>
                      </div>
                      <Switch
                        id="whatsapp-notifications"
                        checked={notifications.whatsapp}
                        onCheckedChange={(checked) => handleNotificationChange("whatsapp", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="task-updates">Task Updates</Label>
                        <p className="text-sm text-gray-500">When tasks are assigned or updated</p>
                      </div>
                      <Switch
                        id="task-updates"
                        checked={notifications.taskUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("taskUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="project-deadlines">Project Deadlines</Label>
                        <p className="text-sm text-gray-500">Reminders for upcoming deadlines</p>
                      </div>
                      <Switch
                        id="project-deadlines"
                        checked={notifications.projectDeadlines}
                        onCheckedChange={(checked) => handleNotificationChange("projectDeadlines", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="team-mentions">Team Mentions</Label>
                        <p className="text-sm text-gray-500">When you're mentioned in comments</p>
                      </div>
                      <Switch
                        id="team-mentions"
                        checked={notifications.teamMentions}
                        onCheckedChange={(checked) => handleNotificationChange("teamMentions", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Theme</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        theme === "light" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <p className="font-medium">Light</p>
                      <p className="text-sm text-gray-500">Clean and bright interface</p>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        theme === "dark" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <div className="w-full h-20 bg-gray-800 border rounded mb-2"></div>
                      <p className="font-medium">Dark</p>
                      <p className="text-sm text-gray-500">Easy on the eyes</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Layout</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-gray-500">Reduce spacing for more content</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sidebar-collapsed">Collapse Sidebar by Default</Label>
                      <p className="text-sm text-gray-500">Start with sidebar collapsed</p>
                    </div>
                    <Switch id="sidebar-collapsed" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Password</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Account Actions</h4>
                  <div className="space-y-3">
                    <Button variant="outline" onClick={logout} className="w-full justify-start bg-transparent">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with external services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">GH</span>
                      </div>
                      <div>
                        <h4 className="font-medium">GitHub</h4>
                        <p className="text-sm text-gray-500">Connect your repositories</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">WA</span>
                      </div>
                      <div>
                        <h4 className="font-medium">WhatsApp Business</h4>
                        <p className="text-sm text-gray-500">Send task notifications via WhatsApp</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">SL</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Slack</h4>
                        <p className="text-sm text-gray-500">Get notifications in Slack</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">GM</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Gmail</h4>
                        <p className="text-sm text-gray-500">Send email notifications</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
