"use client"

import { useState, useEffect } from "react"
import { Palette, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface IconStyle {
  id: string
  name: string
  description: string
  category: "classic" | "vibrant" | "special"
  gradient: string
  textColor: string
}

const iconStyles: IconStyle[] = [
  {
    id: "google",
    name: "Google Colors",
    description: "Original colorful design",
    category: "classic",
    gradient: "bg-gradient-to-br from-blue-500 via-red-500 via-yellow-500 to-green-500",
    textColor: "text-white",
  },
  {
    id: "blue",
    name: "Ocean Blue",
    description: "Deep blue gradient",
    category: "classic",
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    textColor: "text-white",
  },
  {
    id: "purple",
    name: "Royal Purple",
    description: "Elegant purple tones",
    category: "vibrant",
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    textColor: "text-white",
  },
  {
    id: "green",
    name: "Forest Green",
    description: "Natural green shades",
    category: "vibrant",
    gradient: "bg-gradient-to-br from-green-400 to-green-600",
    textColor: "text-white",
  },
  {
    id: "orange",
    name: "Sunset Orange",
    description: "Warm orange gradient",
    category: "vibrant",
    gradient: "bg-gradient-to-br from-orange-400 to-red-500",
    textColor: "text-white",
  },
  {
    id: "pink",
    name: "Rose Pink",
    description: "Soft pink gradient",
    category: "vibrant",
    gradient: "bg-gradient-to-br from-pink-400 to-pink-600",
    textColor: "text-white",
  },
  {
    id: "cyan",
    name: "Electric Cyan",
    description: "Bright cyan blue",
    category: "vibrant",
    gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    textColor: "text-white",
  },
  {
    id: "gold",
    name: "Golden",
    description: "Luxurious gold finish",
    category: "special",
    gradient: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600",
    textColor: "text-yellow-900",
  },
  {
    id: "silver",
    name: "Silver",
    description: "Sleek metallic silver",
    category: "special",
    gradient: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
    textColor: "text-gray-800",
  },
  {
    id: "pride",
    name: "Pride Rainbow",
    description: "Celebrate diversity and inclusion",
    category: "special",
    gradient: "pride-gradient",
    textColor: "text-white",
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Perfect for AMOLED displays",
    category: "classic",
    gradient: "bg-gradient-to-br from-gray-800 to-black",
    textColor: "text-white",
  },
  {
    id: "neon",
    name: "Neon Glow",
    description: "Cyberpunk neon effect",
    category: "special",
    gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400",
    textColor: "text-white",
  },
]

const categoryLabels = {
  classic: "Classic",
  vibrant: "Vibrant",
  special: "Special Edition",
}

export function IconCustomization() {
  const [currentIcon, setCurrentIcon] = useState("google")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved icon style from localStorage
    const savedIcon = localStorage.getItem("ultraxasIconStyle")
    if (savedIcon) {
      setCurrentIcon(savedIcon)
      applyIconStyle(savedIcon)
    }
  }, [])

  const applyIconStyle = (iconId: string) => {
    try {
      const iconStyle = iconStyles.find((style) => style.id === iconId)
      if (!iconStyle) return

      // Update all logo elements
      const logoElements = document.querySelectorAll('[data-logo="ultraxas"]')
      logoElements.forEach((element) => {
        // First, remove all existing gradient classes
        element.className = element.className
          .split(" ")
          .filter((cls) => !cls.includes("gradient") && cls !== "pride-gradient")
          .join(" ")

        // Then add the new gradient class
        if (iconStyle.gradient === "pride-gradient") {
          element.classList.add("pride-gradient")
        } else {
          // For regular gradients, add each class separately
          iconStyle.gradient.split(" ").forEach((cls) => {
            element.classList.add(cls)
          })
        }
      })

      // Update text color for logo text
      const logoTexts = document.querySelectorAll('[data-logo-text="ultraxas"]')
      logoTexts.forEach((element) => {
        // Remove existing text color classes
        element.className = element.className
          .split(" ")
          .filter((cls) => !cls.includes("text-"))
          .join(" ")

        // Add new text color classes
        iconStyle.textColor.split(" ").forEach((cls) => {
          element.classList.add(cls)
        })
      })
    } catch (error) {
      console.error("Error applying icon style:", error)
    }
  }

  const selectIcon = (iconId: string) => {
    setCurrentIcon(iconId)
    applyIconStyle(iconId)
    localStorage.setItem("ultraxasIconStyle", iconId)
    setIsOpen(false)

    const iconStyle = iconStyles.find((style) => style.id === iconId)
    toast({
      title: "Icon Updated! 🎨",
      description: `Switched to ${iconStyle?.name} style`,
    })
  }

  const resetIcon = () => {
    setCurrentIcon("google")
    applyIconStyle("google")
    localStorage.setItem("ultraxasIconStyle", "google")
    setIsOpen(false)

    toast({
      title: "Icon Reset! 🔄",
      description: "Restored to default Google Colors",
    })
  }

  const currentIconData = iconStyles.find((style) => style.id === currentIcon) || iconStyles[0]

  const groupedIcons = iconStyles.reduce(
    (acc, icon) => {
      if (!acc[icon.category]) {
        acc[icon.category] = []
      }
      acc[icon.category].push(icon)
      return acc
    },
    {} as Record<string, IconStyle[]>,
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <Palette className="h-4 w-4" />
          App Icon Style
        </h4>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <div
                className={`w-4 h-4 rounded ${currentIconData.gradient} flex items-center justify-center`}
                data-logo="ultraxas"
              >
                <span className={`text-xs font-bold ${currentIconData.textColor}`} data-logo-text="ultraxas">
                  U
                </span>
              </div>
              <span className="hidden sm:inline">{currentIconData.name}</span>
              <span className="sm:hidden">Style</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[90vw] sm:max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Icon Style
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {Object.entries(groupedIcons).map(([category, categoryIcons]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </h4>
                    {category === "special" && (
                      <Badge variant="secondary" className="text-xs">
                        ✨
                      </Badge>
                    )}
                  </div>

                  <div className="grid gap-2">
                    {categoryIcons.map((iconStyle) => (
                      <Card
                        key={iconStyle.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          currentIcon === iconStyle.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => selectIcon(iconStyle.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg ${iconStyle.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                            >
                              <span className={`text-lg font-bold ${iconStyle.textColor}`}>U</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-sm">{iconStyle.name}</h5>
                                {iconStyle.id === "pride" && <span className="text-sm">🏳️‍🌈</span>}
                                {iconStyle.id === "neon" && <span className="text-sm">⚡</span>}
                                {iconStyle.id === "gold" && <span className="text-sm">👑</span>}
                              </div>
                              <p className="text-xs text-muted-foreground">{iconStyle.description}</p>
                            </div>
                            {currentIcon === iconStyle.id && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={resetIcon}
                  className="w-full gap-2"
                  disabled={currentIcon === "google"}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview */}
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm font-medium mb-3">Current Icon Preview:</p>
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl ${currentIconData.gradient} flex items-center justify-center shadow-lg`}
            data-logo="ultraxas"
          >
            <span className={`text-xl font-bold ${currentIconData.textColor}`} data-logo-text="ultraxas">
              U
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{currentIconData.name}</p>
            <p className="text-xs text-muted-foreground">{currentIconData.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
