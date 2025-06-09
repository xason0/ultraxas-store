"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  Clock,
  Package,
  Sparkles,
  RefreshCw,
  Download,
  ExternalLink,
  Globe,
  User,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface App {
  packageName: string
  name: string
  summary: string
  description: string
  icon: string | null
  categories: string[]
  version: string
  versionCode: number
  size: string
  sizeBytes: number
  license: string
  developer: string
  authorEmail: string | null
  webSite: string | null
  sourceCode: string | null
  issueTracker: string | null
  added: number
  lastUpdated: number
  lastUpdatedFormatted: string
  minSdkVersion: number
  targetSdkVersion: number
  apkName: string
  downloadUrl: string
  storeUrl: string
  hash: string | null
  antiFeatures: string[]
  permissions: string[]
  features: string[]
  rating: number
  downloads: number
  reviews: number
  isPopular: boolean
  isFeatured: boolean
  isNew: boolean
}

interface AppData {
  metadata: {
    totalApps: number
    lastUpdated: string
    version: string
    source: string
    featuredApps: number
    popularApps: number
    newApps: number
  }
  apps: App[]
}

// Sample data for when the real data isn't available yet
const sampleApps: App[] = [
  {
    packageName: "org.fdroid.fdroid",
    name: "F-Droid",
    summary: "The Free and Open Source Android App Store",
    description:
      "F-Droid is an installable catalogue of FOSS (Free and Open Source Software) applications for the Android platform. The client makes it easy to browse, install, and keep track of updates on your device.",
    icon: "/placeholder.svg?height=100&width=100",
    categories: ["System"],
    version: "1.15.2",
    versionCode: 1015002,
    size: "8.4 MB",
    sizeBytes: 8400000,
    license: "GPL-3.0-or-later",
    developer: "F-Droid",
    authorEmail: null,
    webSite: "https://f-droid.org",
    sourceCode: "https://gitlab.com/fdroid/fdroidclient",
    issueTracker: "https://gitlab.com/fdroid/fdroidclient/issues",
    added: 1303689600000,
    lastUpdated: 1643673600000,
    lastUpdatedFormatted: "Feb 1, 2022",
    minSdkVersion: 22,
    targetSdkVersion: 30,
    apkName: "fdroid.apk",
    downloadUrl: "https://f-droid.org/repo/org.fdroid.fdroid_1015002.apk",
    storeUrl: "https://f-droid.org/packages/org.fdroid.fdroid/",
    hash: null,
    antiFeatures: [],
    permissions: [],
    features: [],
    rating: 4.8,
    downloads: 5000000,
    reviews: 2500,
    isPopular: true,
    isFeatured: true,
    isNew: false,
  },
  {
    packageName: "org.mozilla.firefox",
    name: "Firefox",
    summary: "Fast, private and secure web browser",
    description:
      "Experience a fast, smart and personal Web. Firefox is the independent, people-first browser made by Mozilla, voted the Most Trusted Internet Company for Privacy.",
    icon: "/placeholder.svg?height=100&width=100",
    categories: ["Internet", "Browsing"],
    version: "98.3.0",
    versionCode: 983000,
    size: "64.2 MB",
    sizeBytes: 64200000,
    license: "MPL-2.0",
    developer: "Mozilla",
    authorEmail: null,
    webSite: "https://www.mozilla.org",
    sourceCode: "https://hg.mozilla.org/mozilla-central/",
    issueTracker: "https://bugzilla.mozilla.org/",
    added: 1303689600000,
    lastUpdated: 1646265600000,
    lastUpdatedFormatted: "Mar 3, 2022",
    minSdkVersion: 21,
    targetSdkVersion: 30,
    apkName: "firefox.apk",
    downloadUrl: "https://f-droid.org/repo/org.mozilla.firefox_983000.apk",
    storeUrl: "https://f-droid.org/packages/org.mozilla.firefox/",
    hash: null,
    antiFeatures: [],
    permissions: [],
    features: [],
    rating: 4.6,
    downloads: 10000000,
    reviews: 5000,
    isPopular: true,
    isFeatured: true,
    isNew: false,
  },
  {
    packageName: "org.videolan.vlc",
    name: "VLC",
    summary: "Free and open source multimedia player",
    description:
      "VLC is a free and open source cross-platform multimedia player and framework that plays most multimedia files as well as DVDs, Audio CDs, VCDs, and various streaming protocols.",
    icon: "/placeholder.svg?height=100&width=100",
    categories: ["Multimedia", "Video"],
    version: "3.4.4",
    versionCode: 30404,
    size: "32.1 MB",
    sizeBytes: 32100000,
    license: "GPL-2.0-or-later",
    developer: "VideoLAN",
    authorEmail: null,
    webSite: "https://www.videolan.org/vlc/",
    sourceCode: "https://code.videolan.org/videolan/vlc-android",
    issueTracker: "https://code.videolan.org/videolan/vlc-android/issues",
    added: 1303689600000,
    lastUpdated: 1641168000000,
    lastUpdatedFormatted: "Jan 3, 2022",
    minSdkVersion: 17,
    targetSdkVersion: 30,
    apkName: "vlc.apk",
    downloadUrl: "https://f-droid.org/repo/org.videolan.vlc_30404.apk",
    storeUrl: "https://f-droid.org/packages/org.videolan.vlc/",
    hash: null,
    antiFeatures: [],
    permissions: [],
    features: [],
    rating: 4.7,
    downloads: 8000000,
    reviews: 4000,
    isPopular: true,
    isFeatured: true,
    isNew: false,
  },
]

const sampleData: AppData = {
  metadata: {
    totalApps: 3,
    lastUpdated: new Date().toISOString(),
    version: "1.0.0",
    source: "Sample Data",
    featuredApps: 3,
    popularApps: 3,
    newApps: 0,
  },
  apps: sampleApps,
}

export default function OpenSourcePage() {
  const [data, setData] = useState<AppData | null>(null)
  const [filteredApps, setFilteredApps] = useState<App[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTab, setSelectedTab] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSetupInstructions, setShowSetupInstructions] = useState(false)

  // Load apps data
  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("📱 Loading F-Droid apps...")

      const response = await fetch("/data/fdroid-apps.json")

      if (!response.ok) {
        console.error(`Failed to load apps: ${response.status}`)
        throw new Error(`Failed to load apps: ${response.status}`)
      }

      const text = await response.text()

      // Check if the response is valid JSON
      try {
        const appData: AppData = JSON.parse(text)
        console.log(`✅ Loaded ${appData.apps.length} F-Droid apps`)
        console.log(`📊 Featured: ${appData.metadata.featuredApps}, Popular: ${appData.metadata.popularApps}`)

        setData(appData)

        // Set initial filtered apps based on selected tab
        if (selectedTab === "featured") {
          setFilteredApps(appData.apps.filter((app) => app.isFeatured))
        } else if (selectedTab === "popular") {
          setFilteredApps(appData.apps.filter((app) => app.isPopular))
        } else if (selectedTab === "new") {
          setFilteredApps(appData.apps.filter((app) => app.isNew))
        } else {
          setFilteredApps(appData.apps.sort((a, b) => b.rating - a.rating).slice(0, 100))
        }
      } catch (jsonError) {
        console.error("Invalid JSON response:", jsonError)

        // If the file doesn't exist or is invalid, use sample data
        console.log("Using sample data instead")
        setData(sampleData)
        setFilteredApps(sampleData.apps)
        setShowSetupInstructions(true)
        setError("F-Droid apps data not found. Please run the GitHub Action to populate apps.")
      }
    } catch (error) {
      console.error("Error loading apps:", error)

      // Use sample data as fallback
      console.log("Using sample data as fallback")
      setData(sampleData)
      setFilteredApps(sampleData.apps)
      setShowSetupInstructions(true)
      setError("Unable to load F-Droid apps. Please run the GitHub Action to populate apps.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadApps()
    setIsRefreshing(false)
  }

  // Filter apps based on search, category, and tab
  useEffect(() => {
    if (!data) return

    let filtered = data.apps

    // Filter by tab
    if (selectedTab === "featured") {
      filtered = filtered.filter((app) => app.isFeatured)
    } else if (selectedTab === "popular") {
      filtered = filtered.filter((app) => app.isPopular)
    } else if (selectedTab === "new") {
      filtered = filtered.filter((app) => app.isNew)
    } else if (selectedTab === "top") {
      filtered = filtered.sort((a, b) => b.rating - a.rating).slice(0, 100)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.summary.toLowerCase().includes(query) ||
          app.developer.toLowerCase().includes(query) ||
          app.categories.some((cat) => cat.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((app) => app.categories.includes(selectedCategory))
    }

    setFilteredApps(filtered)
  }, [data, searchQuery, selectedCategory, selectedTab])

  // Get unique categories
  const categories = data ? Array.from(new Set(data.apps.flatMap((app) => app.categories))).sort() : []

  const handleDownload = async (app: App) => {
    try {
      console.log(`📥 Starting download: ${app.name}`)

      // Create download link
      const link = document.createElement("a")
      link.href = app.downloadUrl
      link.download = app.apkName
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`✅ Download initiated: ${app.name}`)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback: open in new tab
      window.open(app.downloadUrl, "_blank")
    }
  }

  const openAppPage = (app: App) => {
    window.open(app.storeUrl, "_blank")
  }

  const openWebsite = (url: string) => {
    window.open(url, "_blank")
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Open Source</h1>
          <div className="text-right">
            <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
              <Package className="h-4 w-4 animate-spin" />
              Loading...
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-300 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Open Source</h1>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <Package className="h-4 w-4" />
            F-Droid
          </p>
          {data && <p className="text-xs text-muted-foreground">{data.metadata.totalApps} apps</p>}
        </div>
      </div>

      <p className="text-muted-foreground mb-6">Discover free and open source Android apps</p>

      {/* Setup Instructions */}
      {showSetupInstructions && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Setup Required</AlertTitle>
          <AlertDescription>
            <p className="mb-2">To display real F-Droid apps, please run the GitHub Action:</p>
            <ol className="list-decimal pl-5 mb-3 space-y-1">
              <li>Go to your GitHub repository</li>
              <li>Click on the "Actions" tab</li>
              <li>Select "Update F-Droid Apps Data"</li>
              <li>Click "Run workflow"</li>
              <li>Wait for the workflow to complete (10-15 minutes)</li>
            </ol>
            <p className="text-sm text-muted-foreground">Meanwhile, sample data is being displayed.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && !showSetupInstructions && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="featured" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="popular" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="new" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            New
          </TabsTrigger>
          <TabsTrigger value="top" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Top
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search apps, developers, categories..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => {
              const count = data?.apps.filter((app) => app.categories.includes(category)).length || 0
              return (
                <SelectItem key={category} value={category}>
                  {category} ({count})
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {filteredApps.length} app{filteredApps.length !== 1 ? "s" : ""} found
        </span>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedTab === "featured" && "✨ Featured"}
            {selectedTab === "popular" && "🔥 Popular"}
            {selectedTab === "new" && "🆕 New"}
            {selectedTab === "top" && "⭐ Top Rated"}
          </Badge>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedCategory !== "all"
                ? `No apps found for "${searchQuery || selectedCategory}"`
                : "No apps available"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filter.</p>
            )}
            <Button className="mt-4" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Apps
                </>
              )}
            </Button>
          </div>
        ) : (
          filteredApps.map((app) => (
            <Card key={app.packageName} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage
                      src={app.icon || "/placeholder.svg?height=100&width=100&query=App"}
                      alt={app.name}
                      className="rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=100&width=100"
                      }}
                    />
                    <AvatarFallback className="text-lg font-bold rounded-lg bg-blue-100 text-blue-700">
                      {app.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {app.name}
                      {app.isFeatured && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {app.isPopular && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {app.isNew && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          🆕 New
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm mb-2 line-clamp-2">{app.summary}</CardDescription>

                    {/* App Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{app.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{formatNumber(app.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{app.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {app.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    <span className="text-sm text-muted-foreground">v{app.version}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-24">{app.developer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{app.lastUpdatedFormatted}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => handleDownload(app)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download APK
                  </Button>

                  <Button variant="outline" size="icon" onClick={() => openAppPage(app)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>

                  {app.webSite && (
                    <Button variant="outline" size="icon" onClick={() => openWebsite(app.webSite!)}>
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Footer Info */}
      {filteredApps.length > 0 && data && (
        <div className="mt-8 text-center text-xs text-muted-foreground space-y-1">
          <p>All apps are from the F-Droid repository</p>
          <p>Last updated: {new Date(data.metadata.lastUpdated).toLocaleDateString()}</p>
          <p>Powered by UltraXas Store</p>
        </div>
      )}
    </div>
  )
}
