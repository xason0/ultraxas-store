"use client"

import { useState } from "react"
import { Search, Upload, Package, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PublicAppsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Apps</h1>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <Package className="h-4 w-4" />
            UltraXas
          </p>
          <p className="text-xs text-muted-foreground">0 apps</p>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">Discover amazing Android apps</p>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search apps..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Empty State */}
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-xl font-bold mb-2">No Apps Yet</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          This section is ready for amazing apps. Upload your first app to get started!
        </p>

        <div className="space-y-3">
          <Link href="/upload">
            <Button className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First App
            </Button>
          </Link>

          <Link href="/open-source">
            <Button variant="outline" className="w-full max-w-xs">
              <Sparkles className="h-4 w-4 mr-2" />
              Browse Open Source Apps
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Apps
            </CardTitle>
            <CardDescription>
              Share your Android apps with the community. Upload APK files and manage your app store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upload">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Open Source
            </CardTitle>
            <CardDescription>
              Explore thousands of free and open source Android apps from F-Droid repository.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/open-source">
              <Button variant="outline" className="w-full">
                Browse Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
