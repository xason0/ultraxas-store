"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavigationControls } from "./navigation-controls"

export default function StoreHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const isSearchPage = pathname === "/search"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 safe-area-pt ${
        isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-background"
      }`}
    >
      <div className="container max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/apps" className="text-lg font-medium hover:text-primary transition-colors">
                    Apps
                  </Link>
                  <Link href="/games" className="text-lg font-medium hover:text-primary transition-colors">
                    Games
                  </Link>
                  <Link href="/editorial" className="text-lg font-medium hover:text-primary transition-colors">
                    Editorial
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">
                    About
                  </Link>
                  <Link href="/more" className="text-lg font-medium hover:text-primary transition-colors">
                    More
                  </Link>
                  <div className="mt-4">
                    <NavigationControls />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 bg-gradient-to-br from-google-blue via-google-red to-google-green rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div className="animated-logo">
                <span className="text-google-blue">U</span>
                <span className="text-google-red">l</span>
                <span className="text-google-yellow">t</span>
                <span className="text-google-blue">r</span>
                <span className="text-google-green">a</span>
                <span className="text-google-red">X</span>
                <span className="text-google-yellow">a</span>
                <span className="text-google-blue">s</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[150px] sm:w-[200px] pl-8 rounded-full bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => (window.location.href = "/search")}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <div className="hidden md:block">
              <NavigationControls />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
