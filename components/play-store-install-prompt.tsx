"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Star, Shield, Smartphone, X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PlayStoreInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showFullPrompt, setShowFullPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://")
      setIsInstalled(isStandalone)
      return isStandalone
    }

    if (checkInstalled()) return

    // Check if user dismissed recently
    const lastDismissed = localStorage.getItem("pwa-install-dismissed")
    if (lastDismissed) {
      const dismissTime = Number.parseInt(lastDismissed, 10)
      const hoursSince = (Date.now() - dismissTime) / (1000 * 60 * 60)
      if (hoursSince < 24) return // Don't show for 24 hours
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)

      // Show mini prompt after 2 seconds
      setTimeout(() => setIsVisible(true), 2000)

      // Show full prompt after 5 seconds if not interacted
      setTimeout(() => {
        if (!isInstalled) {
          setShowFullPrompt(true)
        }
      }, 5000)
    }

    // Listen for install events
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setIsVisible(false)
      setShowFullPrompt(false)
      localStorage.removeItem("pwa-install-dismissed")
    })

    // Force show for testing (remove in production)
    setTimeout(() => {
      if (!installPrompt && !isInstalled) {
        setIsVisible(true)
        setTimeout(() => setShowFullPrompt(true), 3000)
      }
    }, 1000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [installPrompt, isInstalled])

  const handleInstall = async () => {
    if (!installPrompt) {
      // Fallback instructions for browsers that don't support install prompt
      setShowFullPrompt(true)
      return
    }

    setIsInstalling(true)

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true)
        setIsVisible(false)
        setShowFullPrompt(false)
      } else {
        localStorage.setItem("pwa-install-dismissed", Date.now().toString())
        setIsVisible(false)
        setShowFullPrompt(false)
      }
    } catch (error) {
      console.error("Install failed:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const dismissPrompt = () => {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
    setIsVisible(false)
    setShowFullPrompt(false)
  }

  if (isInstalled) return null

  // Mini floating install button
  if (isVisible && !showFullPrompt) {
    return (
      <div className="fixed bottom-20 right-4 z-50 animate-bounce">
        <Button
          onClick={() => setShowFullPrompt(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg"
        >
          <Download className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  // Full Play Store-like install prompt
  if (showFullPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button onClick={dismissPrompt} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">UltraXas Store</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">UltraXas Developers</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">1K+</div>
                  <div className="text-xs text-gray-500">Downloads</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Free</div>
                  <div className="text-xs text-gray-500">Price</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Private app distribution platform for UltraXas Dev team. Install and manage apps securely with offline
                support and 1TB storage.
              </p>
            </div>

            {/* Security badges */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Offline Ready
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  PWA
                </Badge>
              </div>
            </div>

            {/* Install button */}
            <div className="p-6 pt-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg"
              >
                {isInstalling ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Installing...
                  </div>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Install App
                  </>
                )}
              </Button>

              {!installPrompt && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                    <strong>Manual Install:</strong>
                    <br />• iOS: Tap Share → "Add to Home Screen"
                    <br />• Android: Menu → "Install app" or "Add to Home screen"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
