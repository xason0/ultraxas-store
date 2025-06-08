import type { App } from "./types"

// Create SVG data URLs for app icons
const createSvgIcon = (bgColor: string, text: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="${bgColor}"/>
    <text x="50" y="50" font-family="Arial" font-size="40" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${text}</text>
  </svg>`

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// UltraXas App icons (empty array - will be populated by user uploads)
export const apps: App[] = []

export const featuredApps: App[] = []

// Function to get all apps (from storage or default)
export async function getAllApps(): Promise<App[]> {
  if (typeof window === "undefined") return []

  try {
    // Try to get apps from localStorage
    const stored = localStorage.getItem("ultraxas_apps")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading apps:", error)
  }

  return [] // Return empty array if no apps found
}
