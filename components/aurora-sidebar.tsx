"use client"

import { useState } from "react"
import {
  X,
  User,
  Settings,
  Palette,
  Globe,
  HelpCircle,
  Info,
  Github,
  Coffee,
  MessageCircle,
  Shield,
  Upload,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuroraSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AuroraSidebar({ isOpen, onClose }: AuroraSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [adminPassword, setAdminPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const handleAdminLogin = () => {
    if (adminPassword === "4933") {
      setIsAdmin(true)
      setAdminPassword("")
    }
  }

  const handleLinkClick = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      window.location.href = href
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-80 bg-background border-l shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="font-semibold text-lg">UltraXas Store</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Section */}
          <div className="p-4 bg-muted/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium">UltraXas User</p>
                <p className="text-sm text-muted-foreground">user@ultraxas.com</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => handleLinkClick("/profile")}>
              Manage your account
            </Button>
          </div>

          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Apps & Management */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleLinkClick("/public-apps")}
              >
                <Upload className="h-5 w-5 mr-3" />
                My apps & uploads
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleLinkClick("/open-source")}
              >
                <Github className="h-5 w-5 mr-3" />
                Open Source Apps
              </Button>

              {isAdmin && (
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => handleLinkClick("/upload")}
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  App Manager (Admin)
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            {/* Settings & Preferences */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleLinkClick("/settings")}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div className="flex items-center">
                  <Palette className="h-5 w-5 mr-3" />
                  <span>Theme</span>
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="bg-transparent border rounded px-2 py-1 text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="black">Black</option>
                  <option value="system">System</option>
                </select>
              </div>

              <Button variant="ghost" className="w-full justify-start h-12">
                <Globe className="h-5 w-5 mr-3" />
                Language
                <span className="ml-auto text-sm text-muted-foreground">English</span>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Support & Info */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleLinkClick("https://github.com/xason0/ultraxas-store/issues")}
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                Help Center
              </Button>

              <Button variant="ghost" className="w-full justify-start h-12" onClick={() => handleLinkClick("/about")}>
                <Info className="h-5 w-5 mr-3" />
                About
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleLinkClick("https://buymeacoffee.com/xason0")}
              >
                <Coffee className="h-5 w-5 mr-3" />
                Buy Me a Coffee
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleLinkClick("https://t.me/xason0")}
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Contact Developer
              </Button>
            </div>

            {/* Admin Login */}
            {!isAdmin && (
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Access
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Admin Login</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password"
                        />
                      </div>
                      <Button onClick={handleAdminLogin} className="w-full">
                        Login
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <button onClick={() => handleLinkClick("/privacy")} className="hover:text-foreground transition-colors">
                Privacy policy
              </button>
              <span>•</span>
              <button onClick={() => handleLinkClick("/terms")} className="hover:text-foreground transition-colors">
                Terms of service
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">UltraXas Store v3.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuroraSidebar
