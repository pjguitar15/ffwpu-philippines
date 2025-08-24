"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, ReplyIcon, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  name: string
  comment: string
  date: string
  replies?: any[]
}

interface CommentsSectionProps {
  comments: Comment[]
  onAddComment: (name: string, comment: string) => void
  onAddReply: (commentId: string, name: string, reply: string) => void
}

export function CommentsSection({ comments, onAddComment, onAddReply }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [newName, setNewName] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replyName, setReplyName] = useState("")
  const { toast } = useToast()

  // Simple inappropriate content filter
  const isInappropriate = (text: string) => {
    const inappropriateWords = ["spam", "fake", "scam", "hate"]
    return inappropriateWords.some((word) => text.toLowerCase().includes(word))
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newName.trim() || !newComment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your name and comment.",
        variant: "destructive",
      })
      return
    }

    if (isInappropriate(newComment) || isInappropriate(newName)) {
      toast({
        title: "Comment Blocked",
        description: "Your comment contains inappropriate content and cannot be posted.",
        variant: "destructive",
      })
      return
    }

    onAddComment(newName, newComment)
    setNewName("")
    setNewComment("")
    toast({
      title: "Comment Posted! 💬",
      description: "Thank you for sharing your thoughts with our community.",
    })
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyName.trim() || !replyText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your name and reply.",
        variant: "destructive",
      })
      return
    }

    if (isInappropriate(replyText) || isInappropriate(replyName)) {
      toast({
        title: "Reply Blocked",
        description: "Your reply contains inappropriate content and cannot be posted.",
        variant: "destructive",
      })
      return
    }

    onAddReply(commentId, replyName, replyText)
    setReplyingTo(null)
    setReplyName("")
    setReplyText("")
    toast({
      title: "Reply Posted! 💬",
      description: "Your reply has been added to the conversation.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-heading text-xl font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add New Comment */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold">Join the Conversation</h4>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Input placeholder="Your name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Comment Header */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{comment.comment}</p>
                  </div>
                </div>

                {/* Reply Button */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <ReplyIcon className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="ml-11 space-y-3 border-l-2 border-muted pl-4">
                    <Input
                      placeholder="Your name"
                      value={replyName}
                      onChange={(e) => setReplyName(e.target.value)}
                      size="sm"
                    />
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                        Post Reply
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-3 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{reply.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{reply.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}
