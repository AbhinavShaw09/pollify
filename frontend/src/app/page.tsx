"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, Users, Zap, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"

export default function LandingPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("user")
      if (savedUser && savedUser !== "undefined") {
        router.push("/dashboard")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <BackgroundRippleEffect />
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Pollify</h1>
              <p className="text-xs text-blue-200">Real-time opinion polling</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white hover:cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button 
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Create Polls,
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Gather Opinions</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Build engaging polls, collect real-time responses, and make data-driven decisions with our modern polling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3 text-white hover:cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Start Polling <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 py-3 hover:cursor-pointer"
              onClick={() => router.push("/login")}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-6xl mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700 mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Results</h3>
              <p className="text-blue-100">Watch poll results update live as votes come in</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700 mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Social Features</h3>
              <p className="text-blue-100">Like, comment, and engage with community polls</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700 mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-blue-100">Create and share polls in seconds with our intuitive interface</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
