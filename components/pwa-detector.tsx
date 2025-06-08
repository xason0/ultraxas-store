"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, WifiOff } from "lucide-react"

export function PWADetector() {
  const [pwaStatus, setPwaStatus] = useState({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    hasServiceWorker: false,
    hasManifest: false,
    isStandalone: false,
  })

  useEffect(() => {
    const checkPWAStatus = () => {
      // Check if installed (standalone mode)
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true

      // Check if service worker is registered
      const hasServiceWorker = "serviceWorker" in navigator

      // Check if manifest exists
      const manifestLink = document.querySelector('link[rel="manifest"]')
      const hasManifest = !!manifestLink

      // Check online status
      const isOnline = navigator.onLine

      setPwaStatus({
        isInstalled: isStandalone || isInWebAppiOS,
        isInstallable: hasServiceWorker && hasManifest,
        isOnline,
        hasServiceWorker,
        hasManifest,
        isStandalone: isStandalone || isInWebAppiOS,
      })
    }

    // Initial check
    checkPWAStatus()

    // Listen for online/offline events
    const handleOnline = () => setPwaStatus((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setPwaStatus((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = () => {
      setPwaStatus((prev) => ({ ...prev, isInstallable: true }))
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  return (
    <div className="space-y-3">
      {/* PWA Status Alert */}
      {pwaStatus.isInstalled ? (
        <Alert className="border-green-200 bg-green-50">
          <Smartphone className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>✅ PWA Installed!</strong> You're using the installed app version.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-blue-200 bg-blue-50">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>📱 PWA Ready!</strong> This app can be installed for a better experience.
          </AlertDescription>
        </Alert>
      )}

      {/* Technical Status */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between p-2 bg-muted rounded">
          <span>Service Worker</span>
          <Badge variant={pwaStatus.hasServiceWorker ? "default" : "secondary"}>
            {pwaStatus.hasServiceWorker ? "✅" : "❌"}
          </Badge>
        </div>
        <div className="flex items-center justify-between p-2 bg-muted rounded">
          <span>Manifest</span>
          <Badge variant={pwaStatus.hasManifest ? "default" : "secondary"}>{pwaStatus.hasManifest ? "✅" : "❌"}</Badge>
        </div>
        <div className="flex items-center justify-between p-2 bg-muted rounded">
          <span>Standalone</span>
          <Badge variant={pwaStatus.isStandalone ? "default" : "secondary"}>
            {pwaStatus.isStandalone ? "✅" : "❌"}
          </Badge>
        </div>
        <div className="flex items-center justify-between p-2 bg-muted rounded">
          <span>Connection</span>
          <Badge variant={pwaStatus.isOnline ? "default" : "destructive"}>
            {pwaStatus.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          </Badge>
        </div>
      </div>
    </div>
  )
}
