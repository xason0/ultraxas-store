"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import AppGrid from "@/components/app-grid"
import { getApps } from "@/lib/storage"
import type { App } from "@/lib/types"
import { ConsentModal } from "@/components/consent-modal"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [apps, setApps] = useState<App[]>([])

  useEffect(() => {
    setApps(getApps())
  }, [])

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container max-w-lg mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Welcome Banner - No install button */}
      <div className="banner-gradient rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-center">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <div className="h-12 w-12 bg-gradient-to-br from-google-blue via-google-red to-google-green rounded-xl flex items-center justify-center animate-pulse mr-2">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            <span className="text-google-blue">Welcome to </span>
            <span className="text-google-red">UltraXas </span>
            <span className="text-google-green">Store</span>
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
          Private app store for the UltraXas Dev team
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search our apps..."
            className="pl-9 h-10 sm:h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">
        {searchQuery ? `Search Results (${filteredApps.length})` : "Your Apps"}
      </h2>

      <AppGrid apps={filteredApps.length > 0 ? filteredApps : apps} />

      {apps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-muted-foreground text-lg mb-2">No apps available yet</p>
          <p className="text-sm text-muted-foreground">Upload your first app using the Upload tab below!</p>
        </div>
      )}

      {/* Add the ConsentModal component here */}
      <ConsentModal />
    </div>
  )
}
