"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AppGrid from "@/components/app-grid"
import { getApps } from "@/lib/storage"
import type { App } from "@/lib/types"

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [apps, setApps] = useState<App[]>([])
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")

  useEffect(() => {
    setApps(getApps())
  }, [])

  const filteredApps = apps
    .filter(
      (app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime()
        case "size":
          return Number.parseFloat(b.size) - Number.parseFloat(a.size)
        default:
          return 0
      }
    })

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Apps</h1>
        <div className="text-right">
          <p className="text-sm font-medium flex">
            <span className="text-google-blue">U</span>
            <span className="text-google-red">l</span>
            <span className="text-google-yellow">t</span>
            <span className="text-google-blue">r</span>
            <span className="text-google-green">a</span>
            <span className="text-google-red">X</span>
            <span className="text-google-yellow">a</span>
            <span className="text-google-blue">s</span>
          </p>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">Browse all apps developed by our team</p>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search apps..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <Button
          variant={sortBy === "name" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("name")}
          className="whitespace-nowrap"
        >
          Name
        </Button>
        <Button
          variant={sortBy === "date" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("date")}
          className="whitespace-nowrap"
        >
          Latest
        </Button>
        <Button
          variant={sortBy === "size" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("size")}
          className="whitespace-nowrap"
        >
          Size
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{filteredApps.length} apps found</span>
      </div>

      <AppGrid apps={filteredApps} />

      {filteredApps.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted-foreground text-lg">No apps found for "{searchQuery}"</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  )
}
