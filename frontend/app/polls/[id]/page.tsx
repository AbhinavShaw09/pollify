"use client"

import { useState, use } from "react"
import { API_BASE_URL } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function PollDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedOption, setSelectedOption] = useState("")
  const [newComment, setNewComment] = useState("")
  const queryClient = useQueryClient()
  
  const { data: voteStatus } = useQuery({
    queryKey: ['vote-status', id],
    queryFn: () => {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token")
      return fetch(`${API_BASE_URL}/polls/${id}/vote-status`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json())
    },
    enabled: !!localStorage.getItem("token")
  })
  
  const hasVoted = voteStatus?.has_voted || false
  const userVote = voteStatus?.selected_option

  const { data: poll } = useQuery({
    queryKey: ['poll', id],
    queryFn: () => fetch(`${API_BASE_URL}/polls/${id}`).then(res => res.json())
  })
  
  const { data: results = {} } = useQuery({
    queryKey: ['poll-results', id],
    queryFn: () => fetch(`${API_BASE_URL}/polls/${id}/results`).then(res => res.json())
  })
  
  const { data: comments = [] } = useQuery({
    queryKey: ['poll-comments', id],
    queryFn: () => fetch(`${API_BASE_URL}/polls/${id}/comments`).then(res => res.json())
  })
  
  const voteMutation = useMutation({
    mutationFn: (option: string) => {
      const token = localStorage.getItem("token")
      return fetch(`${API_BASE_URL}/polls/${id}/vote`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ option })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poll-results', id] })
      queryClient.invalidateQueries({ queryKey: ['vote-status', id] })
    }
  })
  
  const commentMutation = useMutation({
    mutationFn: (content: string) => {
      const token = localStorage.getItem("token")
      return fetch(`${API_BASE_URL}/polls/${id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })
    },
    onSuccess: () => {
      setNewComment("")
      queryClient.invalidateQueries({ queryKey: ['poll-comments', id] })
    }
  })
  
  if (!poll) return <div>Loading...</div>
  
  const totalVotes = Object.values(results.results || {}).reduce((sum: number, count) => sum + (count as number), 0)
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost">← Back</Button>
        </Link>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Poll Section */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{poll.question}</h1>
            <p className="text-sm text-muted-foreground">by {poll.username}</p>
            <p className="text-muted-foreground">{totalVotes} votes</p>
            
            {!hasVoted ? (
              <div className="space-y-3">
                {poll.options?.map((option: string) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="vote"
                      value={option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                <Button 
                  onClick={() => voteMutation.mutate(selectedOption)} 
                  disabled={!selectedOption}
                >
                  Vote
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {poll.options?.map((option: string) => {
                  const votes = results.results?.[option] || 0
                  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
                  const isUserVote = option === userVote
                  
                  return (
                    <div key={option} className="space-y-1">
                      <div className="flex justify-between">
                        <span className={isUserVote ? "font-bold text-blue-600" : ""}>
                          {option} {isUserVote && "✓"}
                        </span>
                        <span>{votes} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded h-2">
                        <div
                          className={`h-2 rounded ${isUserVote ? "bg-blue-600" : "bg-blue-500"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              if (newComment.trim()) commentMutation.mutate(newComment.trim())
            }} className="space-y-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit" disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </form>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment: any) => (
                <div key={comment.id} className="p-3 bg-muted rounded">
                  <p>{comment.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {comment.username} • {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}