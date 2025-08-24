"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface SearchAndFilterProps {
  onSearch: (query: string) => void
  onTagFilter: (tags: string[]) => void
  availableTags: string[]
  selectedTags: string[]
}

export function SearchAndFilter({ onSearch, onTagFilter, availableTags, selectedTags }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    onTagFilter(newTags)
  }

  const clearFilters = () => {
    setSearchQuery("")
    onSearch("")
    onTagFilter([])
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search news and articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Tag Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filter by Tags</h3>
          {(selectedTags.length > 0 || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary">
                Search: "{searchQuery}"
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSearchQuery("")
                    onSearch("")
                  }}
                />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
