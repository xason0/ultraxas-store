"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFDroidApps } from "@/hooks/use-fdroid-apps"

const categories = [
  "all",
  "internet",
  "multimedia",
  "games",
  "development",
  "education",
  "science & engineering",
  "security",
  "system",
  "money",
  "reading",
  "writing & publishing",
  "connectivity",
  "location",
  "theming",
  "accessibility",
  "time",
  "phone & sms",
  "navigation",
  "appearance",
  "office",
  "sports & health",
  "tasks",
  "various",
]

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Rating", value: "rating" },
  { label: "Downloads", value: "downloads" },
]

export default function OpenSourcePage() {
  // Move all hooks inside the component function
  const { apps, loading, error } = useFDroidApps()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "downloads">("name")

  const filteredApps = apps
    ?.filter((app) => {
      const searchRegex = new RegExp(searchQuery, "i")
      const categoryMatch =
        selectedCategory === "all" || app.categories?.some((cat) => cat.toLowerCase() === selectedCategory)
      return searchRegex.test(app.name) && categoryMatch
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0)
      } else if (sortBy === "downloads") {
        return (b.downloads || 0) - (a.downloads || 0)
      }
      return 0
    })

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          type="search"
          placeholder="Search apps..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor="category" className="text-nowrap">
            Category:
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="sort" className="text-nowrap">
            Sort by:
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Name" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-[200px]" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-[150px]" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <p className="text-muted-foreground">
            Could not load F-Droid apps. Please check if /public/data/apps.json exists.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[650px] w-full rounded-md border">
          <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredApps?.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{app.name}</CardTitle>
                  <CardDescription className="text-xs">{app.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  {app.categories && app.categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {app.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {app.rating && <div>★ {app.rating}</div>}
                    {app.downloads && <div>{app.downloads.toLocaleString()} downloads</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredApps?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No apps found matching your criteria.</p>
            </div>
          )}
        </ScrollArea>
      )}

      {!loading && !error && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {filteredApps?.length || 0} of {apps?.length || 0} apps
        </div>
      )}
    </div>
  )
}
