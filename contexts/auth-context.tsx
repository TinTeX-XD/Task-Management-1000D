"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("Successfully signed in!")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success("Successfully signed out!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
