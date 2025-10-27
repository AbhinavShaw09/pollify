"use client"

import { useState } from "react"
import { API_BASE_URL } from "@/lib/api/endpoints"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { LikesModal } from "@/components/features/polls/likes-modal"
import Link from "next/link"

interface Poll {
  id: number
  question: string
  options: string[]
  likes: number
  username: string
}

interface PollCardProps {
  poll: Poll
}

export function PollCard({ poll }: PollCardProps) {
  const queryClient = useQueryClient()
  const [showLikesModal, setShowLikesModal] = useState(false)
  
  const { data: results = {} } = useQuery({
    queryKey: ['poll-results', poll.id],
    queryFn: () => fetch(`${API_BASE_URL}/polls/${poll.id}/results`).then(res => res.json())
  })
  
  const { data: comments = [] } = useQuery({
    queryKey: ['poll-comments', poll.id],
    queryFn: () => fetch(`${API_BASE_URL}/polls/${poll.id}/comments`).then(res => res.json())
  })
  
  const { data: likeStatus } = useQuery({
    queryKey: ['like-status', poll.id],
    queryFn: () => {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token")
      return fetch(`${API_BASE_URL}/polls/${poll.id}/like-status`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json())
    },
    enabled: !!localStorage.getItem("token")
  })
  
  const likeMutation = useMutation({
    mutationFn: () => {
      const token = localStorage.getItem("token")
      return fetch(`${API_BASE_URL}/polls/${poll.id}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
      queryClient.invalidateQueries({ queryKey: ['like-status', poll.id] })
    }
  })
    
  const totalVotes = Object.values(results.results || {}).reduce((sum: number, count) => sum + (count as number), 0)
  
  const getPercentage = (option: string) => {
    const votes = results.results?.[option] || 0
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100)
  }
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800">
      <Link href={`/polls/${poll.id}`}>
        <CardHeader className="pb-4 cursor-pointer">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">{poll.question}</h3>
          <p className="text-xs text-muted-foreground">
            by {poll.username}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 cursor-pointer">
          {/* Options Preview */}
          <div className="space-y-3">
            {poll.options.slice(0, 2).map((option) => {
              const percentage = getPercentage(option)
              const votes = results.results?.[option] || 0
              return (
                <div key={option} className="w-full">
                  <div className="relative overflow-hidden rounded-lg border border-border bg-muted/50">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative flex items-center justify-between px-4 py-3">
                      <span className="font-medium text-foreground text-sm">{option}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{votes}</span>
                        <span className="text-sm font-semibold text-foreground">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {poll.options.length > 2 && (
              <p className="text-xs text-muted-foreground text-center">
                +{poll.options.length - 2} more options
              </p>
            )}
          </div>
        </CardContent>
      </Link>
      {/* Actions */}
      <CardContent className="pt-0">
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              likeMutation.mutate()
            }}
            disabled={likeMutation.isPending}
            className={`flex-1 gap-2 ${likeStatus?.has_liked ? "text-red-500" : "text-muted-foreground"} hover:text-red-500`}
          >
            <Heart className="h-4 w-4" fill={likeStatus?.has_liked ? "currentColor" : "none"} />
            <span 
              className="text-xs cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation()
                setShowLikesModal(true)
              }}
            >
              {poll.likes}
            </span>
          </Button>
          <Link href={`/polls/${poll.id}`} className="flex-1">
            <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments.length}</span>
            </Button>
          </Link>
        </div>
        
        <LikesModal 
          pollId={poll.id} 
          open={showLikesModal} 
          onOpenChange={setShowLikesModal} 
        />
      </CardContent>
    </Card>
  )
}