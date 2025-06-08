"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, X, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export function NavigationControls() {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if we can go back/forward
    setCanGoBack(window.history.length > 1)
    setCanGoForward(false) // Forward is typically not available in SPAs

    // Listen for navigation events
    const handlePopState = () => {
      setCanGoBack(window.history.length > 1)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleBack = () => {
    try {
      if (canGoBack) {
        router.back()
        toast({
          title: "Navigating back",
          description: "Going to previous page",
        })
      } else {
        toast({
          title: "Cannot go back",
          description: "No previous page in history",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Navigation failed",
        description: "Unable to go back",
        variant: "destructive",
      })
    }
  }

  const handleForward = () => {
    try {
      window.history.forward()
      toast({
        title: "Navigating forward",
        description: "Going to next page",
      })
    } catch (error) {
      toast({
        title: "Cannot go forward",
        description: "No forward page in history",
        variant: "destructive",
      })
    }
  }

  const handleStop = () => {
    try {
      window.stop()
      setIsLoading(false)
      toast({
        title: "Navigation stopped",
        description: "Page loading has been cancelled",
      })
    } catch (error) {
      toast({
        title: "Stop failed",
        description: "Unable to stop navigation",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    try {
      setIsLoading(true)
      window.location.reload()
      toast({
        title: "Refreshing page",
        description: "Reloading current page",
      })
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Refresh failed",
        description: "Unable to refresh page",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        disabled={!canGoBack}
        className="h-8 w-8"
        title="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleForward}
        disabled={!canGoForward}
        className="h-8 w-8"
        title="Go forward"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleStop}
        disabled={!isLoading}
        className="h-8 w-8"
        title="Stop loading"
      >
        <X className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-8 w-8" title="Refresh page">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}
