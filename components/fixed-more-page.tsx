"use client"

import type React from "react"
import {
  ChevronRight,
  Moon,
  Settings,
  User,
  HelpCircle,
  Info,
  Globe,
  Github,
  Coffee,
  MessageCircle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function FixedMorePage() {
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      window.location.href = href
    }
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">More</h1>

      <div className="space-y-6">
        {/* Account Section */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Account</h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "/profile")}
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "/settings")}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <span>Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Preferences Section */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Preferences</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-primary" />
                <span>Theme</span>
              </div>
              <ModeToggle />
            </div>

            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "/settings")}
            >
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <span>Language</span>
              </div>
              <span className="text-sm text-muted-foreground">English</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Support Section */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Support</h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "https://github.com/xason0/ultraxas-store/issues")}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Help Center</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "/about")}
            >
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <span>About UltraXas Store</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Developer Section */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Developer</h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "https://github.com/xason0")}
            >
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-primary" />
                <span>GitHub Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "https://buymeacoffee.com/xason0")}
            >
              <div className="flex items-center gap-3">
                <Coffee className="h-5 w-5 text-primary" />
                <span>Buy Me a Coffee</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={(e) => handleLinkClick(e, "https://t.me/xason0")}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Contact Developer</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">UltraXas Store v3.0.0</p>
          <p className="text-xs text-muted-foreground">Built with ❤️ by xason0</p>
        </div>
      </div>
    </div>
  )
}

// Default export for easier importing
export default FixedMorePage
