"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Poll {
  id: number
  question: string
  options: string[]
  likes: number
}

export default function PollsList() {
  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: () => fetch("http://localhost:8000/polls/").then(res => res.json())
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Polls</h1>
          <Link href="/create">
            <Button>Create Poll</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {polls.map((poll: Poll) => (
            <Link key={poll.id} href={`/polls/${poll.id}`}>
              <div className="p-6 border border-border rounded-lg hover:bg-accent cursor-pointer">
                <h3 className="text-xl font-semibold mb-2">{poll.question}</h3>
                <p className="text-muted-foreground">{poll.options.length} options • {poll.likes} likes</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
