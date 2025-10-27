"use client"

import { useQuery } from "@tanstack/react-query"
import { API_BASE_URL } from "@/lib/api/endpoints"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart } from "lucide-react"
interface LikesModalProps {
  pollId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function LikesModal({ pollId, open, onOpenChange }: LikesModalProps) {
  const { data: likes = [] } = useQuery({
    queryKey: ['poll-likes', pollId],
    queryFn: () => fetch(`${API_BASE_URL}/polls/${pollId}/likes`).then(res => res.json()),
    enabled: open
  })
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Liked by {likes.length} {likes.length === 1 ? 'person' : 'people'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {likes.map((like: any, index: number) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
                {like.username[0].toUpperCase()}
              </div>
              <span className="text-sm">{like.username}</span>
            </div>
          ))}
          {likes.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No likes yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
};
