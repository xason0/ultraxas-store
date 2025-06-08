"use client"

import { useState, useEffect } from "react"
import { Type } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface FontSettings {
  fontFamily: string
  fontSize: string
}

export function FontCustomization() {
  const { toast } = useToast()
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    fontFamily: "Inter",
    fontSize: "medium",
  })

  // Load saved font settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("ultraxas_font_settings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings) as FontSettings
      setFontSettings(parsed)
      applyFontSettings(parsed)
    }
  }, [])

  // Apply font settings to document
  const applyFontSettings = (settings: FontSettings) => {
    const root = document.documentElement

    // Set font family
    let fontFamilyValue = "var(--font-inter)"
    switch (settings.fontFamily) {
      case "Roboto":
        fontFamilyValue = "Roboto, var(--font-inter), sans-serif"
        break
      case "Open Sans":
        fontFamilyValue = "'Open Sans', var(--font-inter), sans-serif"
        break
      case "Nunito":
        fontFamilyValue = "Nunito, var(--font-inter), sans-serif"
        break
      default:
        fontFamilyValue = "var(--font-inter), sans-serif"
    }

    // Set font size
    let fontSizeValue = "16px"
    switch (settings.fontSize) {
      case "small":
        fontSizeValue = "14px"
        break
      case "large":
        fontSizeValue = "18px"
        break
      default:
        fontSizeValue = "16px"
    }

    // Apply CSS variables
    root.style.setProperty("--font-family", fontFamilyValue)
    root.style.setProperty("--font-size", fontSizeValue)

    // Apply directly to body for immediate effect
    document.body.style.fontFamily = fontFamilyValue
    document.body.style.fontSize = fontSizeValue
  }

  const updateFontSetting = <K extends keyof FontSettings>(key: K, value: FontSettings[K]) => {
    const newSettings = { ...fontSettings, [key]: value }
    setFontSettings(newSettings)
    localStorage.setItem("ultraxas_font_settings", JSON.stringify(newSettings))
    applyFontSettings(newSettings)

    toast({
      title: "Font Updated ✨",
      description: `Font ${key === "fontFamily" ? "family" : "size"} changed to ${value}`,
    })
  }

  // Load font styles
  useEffect(() => {
    // Only load non-Inter fonts as Inter is already loaded by Next.js
    if (fontSettings.fontFamily !== "Inter") {
      const link = document.createElement("link")
      link.rel = "stylesheet"

      switch (fontSettings.fontFamily) {
        case "Roboto":
          link.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          break
        case "Open Sans":
          link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          break
        case "Nunito":
          link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap"
          break
      }

      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [fontSettings.fontFamily])

  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center gap-2">
        <Type className="h-4 w-4" />
        Font Customization
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="font-family">Font Family</Label>
          <Select value={fontSettings.fontFamily} onValueChange={(value) => updateFontSetting("fontFamily", value)}>
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter (Default)</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Nunito">Nunito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size</Label>
          <Select value={fontSettings.fontSize} onValueChange={(value) => updateFontSetting("fontSize", value)}>
            <SelectTrigger id="font-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (14px)</SelectItem>
              <SelectItem value="medium">Medium (16px)</SelectItem>
              <SelectItem value="large">Large (18px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 border rounded-lg mt-2">
        <p className="text-sm font-medium mb-2">Font Preview</p>
        <p
          className="mb-2"
          style={{
            fontFamily: fontSettings.fontFamily === "Inter" ? "var(--font-inter), sans-serif" : fontSettings.fontFamily,
          }}
        >
          This text shows how your selected font family looks.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 border rounded bg-muted/50">
            <p className="text-xs text-center">Small</p>
            <p className="text-center" style={{ fontSize: "14px" }}>
              Aa Bb Cc
            </p>
          </div>
          <div className="p-2 border rounded bg-muted/50">
            <p className="text-xs text-center">Medium</p>
            <p className="text-center" style={{ fontSize: "16px" }}>
              Aa Bb Cc
            </p>
          </div>
          <div className="p-2 border rounded bg-muted/50">
            <p className="text-xs text-center">Large</p>
            <p className="text-center" style={{ fontSize: "18px" }}>
              Aa Bb Cc
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
