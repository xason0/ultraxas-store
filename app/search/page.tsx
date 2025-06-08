"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AppGrid } from "@/components/app-grid"
import type { App } from "@/lib/types"
import { getAllApps } from "@/lib/data"
import { useRouter } from "next/navigation"
import { NavigationControls } from "@/components/navigation-controls"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<App[]>([])
  const [allApps, setAllApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadApps = async () => {
      setIsLoading(true)
      const apps = await getAllApps()
      setAllApps(apps)

      if (initialQuery) {
        const filtered = filterApps(apps, initialQuery)
        setResults(filtered)
      }

      setIsLoading(false)
    }

    loadApps()
  }, [initialQuery])

  const filterApps = (apps: App[], searchQuery: string): App[] => {
    if (!searchQuery.trim()) return []

    const normalizedQuery = searchQuery.toLowerCase().trim()
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(normalizedQuery) ||
        app.description.toLowerCase().includes(normalizedQuery) ||
        app.category.toLowerCase().includes(normalizedQuery),
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = filterApps(allApps, query)
    setResults(filtered)

    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    window.history.pushState({}, "", url)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search apps..."
              className="w-full pl-8 pr-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
        <NavigationControls />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-4">Search Results ({results.length})</h2>
          <AppGrid apps={results} />
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a search term to find apps</p>
        </div>
      )}
    </div>
  )
}
