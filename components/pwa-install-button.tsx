"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Smartphone, Globe, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PWAInstallButtonProps {
  appName: string
  appUrl?: string
  onInstallSuccess?: () => void
}

export function PWAInstallButton({ appName, appUrl, onInstallSuccess }: PWAInstallButtonProps) {
  const { toast } = useToast()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setIsInstallable(false)
      toast({
        title: "App Installed! 🎉",
        description: `${appName} has been installed as a PWA.`,
      })
      onInstallSuccess?.()
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    checkInstalled()

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [appName, onInstallSuccess, toast])

  const handlePWAInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support install prompt
      toast({
        title: "PWA Installation Guide 📱",
        description: "Add this app to your home screen using your browser's menu options.",
      })
      return
    }

    setIsInstalling(true)

    try {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        toast({
          title: "Installing PWA... ⏳",
          description: `${appName} is being installed as a Progressive Web App.`,
        })
      } else {
        toast({
          title: "Installation Cancelled",
          description: "PWA installation was cancelled by user.",
        })
      }

      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error("PWA installation error:", error)
      toast({
        title: "Installation Failed",
        description: "Failed to install PWA. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInstalling(false)
    }
  }

  const handleManualInstall = () => {
    const instructions = {
      Chrome: "Menu → Install app / Add to Home screen",
      Safari: "Share → Add to Home Screen",
      Firefox: "Menu → Install / Add to Home screen",
      Edge: "Menu → Apps → Install this site as an app",
    }

    const userAgent = navigator.userAgent
    let browser = "Chrome"

    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari"
    } else if (userAgent.includes("Firefox")) {
      browser = "Firefox"
    } else if (userAgent.includes("Edge")) {
      browser = "Edge"
    }

    toast({
      title: `PWA Installation Guide (${browser}) 📱`,
      description: instructions[browser as keyof typeof instructions],
    })
  }

  if (isInstalled) {
    return (
      <Button variant="outline" disabled className="flex-1">
        <Check className="mr-2 h-4 w-4" />
        PWA Installed
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={isInstallable ? handlePWAInstall : handleManualInstall}
        disabled={isInstalling}
        className="flex-1 w-full"
      >
        {isInstalling ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Installing PWA...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Install as PWA
          </>
        )}
      </Button>

      {!isInstallable && (
        <Alert className="text-xs">
          <Smartphone className="h-3 w-3" />
          <AlertDescription>
            Use your browser's menu to add this app to your home screen for the best PWA experience.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
