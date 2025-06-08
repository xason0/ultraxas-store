"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3X3, Upload, Settings } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t bottom-nav z-50 safe-area-pb">
      <div className="container max-w-lg mx-auto flex items-center justify-between px-2 sm:px-4">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-2 px-1 sm:px-2 flex-1 transition-colors duration-200 ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/apps"
          className={`flex flex-col items-center justify-center py-2 px-1 sm:px-2 flex-1 transition-colors duration-200 ${
            isActive("/apps") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs mt-1">Apps</span>
        </Link>

        <Link
          href="/upload"
          className={`flex flex-col items-center justify-center py-2 px-1 sm:px-2 flex-1 transition-colors duration-200 ${
            isActive("/upload") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs mt-1">Upload</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center py-2 px-1 sm:px-2 flex-1 transition-colors duration-200 ${
            isActive("/settings") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  )
}
