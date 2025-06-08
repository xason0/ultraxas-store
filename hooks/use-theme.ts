import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "black" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")
  
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
      if (storedTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        document.documentElement.classList.remove("light", "dark", "black")
        document.documentElement.classList.add(systemTheme)
      } else {
        document.documentElement.classList.remove("light", "dark", "black")
        document.documentElement.classList.add(storedTheme)
      }
    } else {
      // Default to black theme for AMOLED
      setTheme("black")
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add("black")
      localStorage.setItem("theme", "black")
    }
  }, [])

  const setThemeValue = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.classList.remove("light", "dark", "black")
      document.documentElement.classList.add(systemTheme)
    } else {
      document.documentElement.classList.remove("light", "dark", "black")
      document.documentElement.classList.add(newTheme)
    }
  }

  return { theme, setTheme: setThemeValue }
}
