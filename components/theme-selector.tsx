"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeSelector() {
  const [theme, setTheme] = useState<"light" | "dark" | "black" | "system">("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "black" | "system" | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  const handleThemeChange = (newTheme: "light" | "dark" | "black" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    const root = document.documentElement
    root.classList.remove("light", "dark", "black")

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size="sm"
        onClick={() => handleThemeChange("light")}
        className="flex-1"
      >
        <Sun className="h-4 w-4 mr-2" />
        Light
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size="sm"
        onClick={() => handleThemeChange("dark")}
        className="flex-1"
      >
        <Moon className="h-4 w-4 mr-2" />
        Dark
      </Button>
      <Button
        variant={theme === "black" ? "default" : "outline"}
        size="sm"
        onClick={() => handleThemeChange("black")}
        className="flex-1"
      >
        <Moon className="h-4 w-4 mr-2" />
        Black
      </Button>
      <Button
        variant={theme === "system" ? "default" : "outline"}
        size="sm"
        onClick={() => handleThemeChange("system")}
        className="flex-1"
      >
        <Monitor className="h-4 w-4 mr-2" />
        System
      </Button>
    </div>
  )
}
