"use client"

import { useState, useEffect } from "react"
import { Download, Smartphone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InstallButtonProps {
  fullWidth?: boolean
}

export function InstallButton({ fullWidth = false }: InstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      toast({
        title: "Installation Complete! 🎉",
        description: "UltraXas Store has been installed successfully.",
      })
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [toast])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    } else {
      // If no install prompt is available, show manual instructions
      setShowInstructions(true)
    }
  }

  if (isInstalled) {
    return (
      <Button variant="outline" className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`} disabled>
        <Smartphone className="h-4 w-4" />
        Already Installed
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleInstall}
        className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}
        variant={fullWidth ? "default" : "outline"}
      >
        <Download className="h-4 w-4" />
        {isIOS ? "Add to Home Screen" : "Install App"}
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install UltraXas Store</DialogTitle>
            <DialogDescription>Follow these steps to install the app on your device</DialogDescription>
          </DialogHeader>

          {isIOS ? (
            <div className="space-y-4">
              <h3 className="font-medium">iOS Installation Steps:</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>
                  Tap the Share button <span className="inline-block px-2 py-1 bg-muted rounded">􀈂</span> at the bottom
                  of your screen
                </li>
                <li>
                  Scroll down and tap <strong>Add to Home Screen</strong>
                </li>
                <li>
                  Tap <strong>Add</strong> in the top right corner
                </li>
              </ol>
              <div className="p-3 bg-muted rounded-md text-sm">
                The app will now appear on your home screen like a native app!
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Installation Steps:</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>
                  Click the install icon <span className="inline-block px-2 py-1 bg-muted rounded">⊕</span> in your
                  browser's address bar
                </li>
                <li>If you don't see an install icon, open your browser menu</li>
                <li>
                  Select <strong>Install App</strong> or <strong>Add to Home screen</strong>
                </li>
              </ol>
              <div className="p-3 bg-muted rounded-md text-sm">
                <p>Different browsers have slightly different installation methods.</p>
                <a
                  href="https://web.dev/learn/pwa/installation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline mt-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Learn more about installing PWAs</span>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
