"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LocalStorage } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Calendar,
  Users,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Team", href: "/team", icon: Users },
  { name: "Clients", href: "/clients", icon: Building2 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setCollapsed(LocalStorage.getSidebarState())
  }, [])

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    LocalStorage.setSidebarState(newState)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-full",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>}
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1.5">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
