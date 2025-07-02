"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Calendar,
  Users,
  UserCheck,
  Settings,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: UserCheck,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: Receipt,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("relative flex flex-col bg-card border-r transition-all duration-300", open ? "w-64" : "w-16")}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4">
        {open && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">TaskFlow</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(!open)} className="h-8 w-8">
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", !open && "px-2", isActive && "bg-secondary")}
                >
                  <item.icon className="h-5 w-5" />
                  {open && <span className="ml-3">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
