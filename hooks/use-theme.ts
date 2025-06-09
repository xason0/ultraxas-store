"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "black" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
      applyTheme(storedTheme)
    } else {
      // Default to black theme for AMOLED
      setTheme("black")
      applyTheme("black")
      localStorage.setItem("theme", "black")
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "black")

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  const setThemeValue = (newTheme: Theme) => {
    if (!mounted) return

    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return { theme, setTheme: setThemeValue, mounted }
}
