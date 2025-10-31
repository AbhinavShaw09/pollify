"use client"

import { useState } from "react"
import { API_BASE_URL } from "@/lib/api/endpoints"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
export default function CreatePoll() {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const router = useRouter()
  const createPollMutation = useMutation({
    mutationFn: (pollData: { question: string; options: string[]; creator_id: number }) =>
      fetch(`${API_BASE_URL}/polls/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pollData)
      }).then(res => res.json()),
    onSuccess: (poll) => {
      router.push(`/polls/${poll.id}`)
    }
  })
  const addOption = () => setOptions([...options, ""])
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }
  const createPoll = () => {
    const validOptions = options.filter(opt => opt.trim())
    if (!question.trim() || validOptions.length < 2) return
    createPollMutation.mutate({
      question: question.trim(),
      options: validOptions,
      creator_id: 1
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Backs</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Create New Poll</h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your question?"
              className="w-full p-3 border border-border rounded-md bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Options</label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-3 border border-border rounded-md bg-background mb-2"
              />
            ))}
            <Button variant="outline" onClick={addOption}>Add Option</Button>
          </div>
          <Button 
            onClick={createPoll} 
            className="w-full"
            disabled={createPollMutation.isPending}
          >
            {createPollMutation.isPending ? "Creating..." : "Create Poll"}
          </Button>
        </div>
      </div>
    </div>
  )
}
