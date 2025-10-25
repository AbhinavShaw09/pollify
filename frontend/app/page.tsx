"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { PollCard } from "@/components/poll-card"
import { CreatePollDialog } from "@/components/create-poll-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/toast"
import { Plus, TrendingUp, User, ChevronDown, Moon, Sun, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Poll {
  id: number
  question: string
  options: string[]
  likes: number
  username: string
}

export default function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  interface User {
    username: string
    // Add other user properties as needed
  }
  
    const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showToast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    showToast("Logged out successfully", "info")
    router.push("/login")
  }

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser && savedUser !== "undefined") {
      try {
        Promise.resolve().then(() => {
          setUser(JSON.parse(savedUser))
          setIsLoading(false)
        })
      } catch (error) {
        localStorage.removeItem("user")
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: polls = [], isLoading: isPollsLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: () => fetch("http://localhost:8000/polls/").then(res => res.json()),
    refetchInterval: 3000 // Real-time updates every 3 seconds
  })

  const handlePollCreated = () => {
    setIsCreateOpen(false)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-slate-50 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pollify</h1>
                <p className="text-xs text-muted-foreground">Real-time opinion polling</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Create Poll
                  </Button>
                  <DropdownMenu
                    trigger={
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        {user.username}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem onClick={toggleTheme} className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Toggle Theme
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {isPollsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-blue-600" />
          </div>
        ) : polls.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No polls yet</h2>
            <p className="mt-2 text-muted-foreground">Be the first to create a poll and start gathering opinions!</p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="h-4 w-4" />
              Create First Poll
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll: Poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </main>

      {/* Create Poll Dialog */}
      <CreatePollDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onPollCreated={handlePollCreated} />
    </div>
  )
}
