"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Loader2 } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem("sidebar-open")
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    // Save sidebar state to localStorage
    localStorage.setItem("sidebar-open", JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
