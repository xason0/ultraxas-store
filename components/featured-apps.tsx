"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { App } from "@/lib/types"

interface FeaturedAppsProps {
  apps: App[]
}

export default function FeaturedApps({ apps }: FeaturedAppsProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth

      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })
    }
  }

  if (apps.length === 0) {
    return (
      <div className="border rounded-xl p-8 mb-8 text-center bg-muted/30">
        <div className="text-4xl mb-4">🚀</div>
        <p className="text-muted-foreground">No featured apps available yet.</p>
      </div>
    )
  }

  return (
    <div className="relative mb-8">
      <div ref={sliderRef} className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 featured-slider hide-scrollbar">
        {apps.map((app) => (
          <Link
            href={`/apps/${app.id}`}
            key={app.id}
            className="relative min-w-[240px] sm:min-w-[280px] h-32 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 border bg-gradient-to-br from-blue-50 to-green-50 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Background Image with proper fallback */}
            <div className="absolute inset-0 flex items-center justify-center">
              {app.icon ? (
                <img
                  src={app.icon || "/placeholder.svg"}
                  alt={app.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover opacity-20"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=80&width=80&text=" + encodeURIComponent(app.name.charAt(0))
                  }}
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary/20 flex items-center justify-center opacity-20">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {app.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4">
              {/* App Icon (smaller version for overlay) */}
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
                  {app.icon ? (
                    <img
                      src={app.icon || "/placeholder.svg"}
                      alt={app.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for overlay icon
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-primary/80 flex items-center justify-center text-white font-bold text-sm">${app.name.charAt(0).toUpperCase()}</div>`
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/80 flex items-center justify-center text-white font-bold text-sm">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base truncate">{app.name}</h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2">{app.description}</p>
                </div>
              </div>

              {/* App Info */}
              <div className="flex items-center gap-2 mt-1 sm:mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-white">{app.rating || "5.0"}</span>
                </div>
                <span className="text-xs text-white/60">v{app.version}</span>
                <span className="text-xs text-white/60">{app.size}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {apps.length > 1 && (
        <>
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
