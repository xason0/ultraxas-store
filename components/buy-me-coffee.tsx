"use client"

import { useEffect, useState } from "react"
import { Coffee, Heart } from "lucide-react"

export function BuyMeCoffee() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show the button after 1 second
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    // Hide the button after 20 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 20000) // 20 seconds

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleCoffeeClick = () => {
    // Open Buy Me a Coffee page
    window.open("https://www.buymeacoffee.com/Manasseh", "_blank", "noopener,noreferrer")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-32 sm:bottom-36 right-2 sm:right-4 z-40">
      <button
        onClick={handleCoffeeClick}
        className="group flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFE55C] text-black font-bold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-black animate-bounce"
        style={{
          fontFamily: "'Cookie', cursive",
          fontSize: "18px",
          letterSpacing: "0.5px",
        }}
        title="Support Manasseh with a coffee!"
      >
        <Coffee className="h-5 w-5 group-hover:animate-pulse" />
        <span>Buy me a coffee</span>
        <Heart className="h-4 w-4 text-red-500 group-hover:animate-pulse" />
      </button>

      {/* Floating animation effect */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>

      {/* Countdown indicator (optional visual feedback) */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-1 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-[19000ms] ease-linear"
            style={{
              width: "100%",
              animation: "countdown 19s linear forwards",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
