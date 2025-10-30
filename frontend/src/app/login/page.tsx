"use client"

import { useState } from "react"
import { API_BASE_URL } from "@/lib/api/endpoints"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import { TrendingUp } from "lucide-react"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const { showToast } = useToast()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isLogin ? "/login" : "/register"
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (isLogin) {
          if (typeof window !== 'undefined') {
            localStorage.setItem("user", JSON.stringify(data.user || data))
            if (data.access_token) {
              localStorage.setItem("token", data.access_token)
            }
          }
          showToast("Login successful!", "success")
          router.push("/dashboard")
        } else {
          showToast("Account created successfully! Please login.", "success")
          setIsLogin(true)
        }
      } else {
        const errorData = await response.json()
        showToast(errorData.detail || "Authentication failed", "error")
      }
    } catch (error) {
      showToast("Something went wrong", "error")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 relative">
      <BackgroundRippleEffect />
      <Card className="w-full max-w-md relative z-10 mx-2.5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground">Pollify</h1>
              <p className="text-sm text-muted-foreground">Real-time opinion polling</p>
            </div>
          </div>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
