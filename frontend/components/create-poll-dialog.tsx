"use client"

import type React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

interface CreatePollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPollCreated: () => void
}

export function CreatePollDialog({ open, onOpenChange, onPollCreated }: CreatePollDialogProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const queryClient = useQueryClient()

  const createPollMutation = useMutation({
    mutationFn: (pollData: { question: string; options: string[] }) => {
      const token = localStorage.getItem("token")
      return fetch("http://localhost:8000/polls/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(pollData)
      }).then(res => res.json())
    },
    onSuccess: () => {
      setQuestion("")
      setOptions(["", ""])
      onOpenChange(false)
      onPollCreated()
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    }
  })

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) {
      alert("Please enter a question")
      return
    }

    const validOptions = options.filter((opt) => opt.trim())
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options")
      return
    }

    createPollMutation.mutate({
      question: question.trim(),
      options: validOptions
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Poll</DialogTitle>
          <DialogDescription>Ask a question and provide options for people to vote on</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Question</label>
            <Input
              placeholder="What's your question?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border-border"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Options</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="border-border"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Option Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddOption}
            className="w-full gap-2 border-border bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Add Option
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createPollMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {createPollMutation.isPending ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
