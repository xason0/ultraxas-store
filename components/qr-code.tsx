"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return

      try {
        // This is a simple placeholder for QR code generation
        // In a real app, you'd use a library like qrcode.js
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Clear canvas
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        // Draw a fake QR code pattern
        ctx.fillStyle = "#000000"

        // Draw border
        ctx.fillRect(20, 20, size - 40, 10)
        ctx.fillRect(20, size - 30, size - 40, 10)
        ctx.fillRect(20, 20, 10, size - 40)
        ctx.fillRect(size - 30, 20, 10, size - 40)

        // Draw position detection patterns
        ctx.fillRect(40, 40, 40, 40)
        ctx.fillRect(size - 80, 40, 40, 40)
        ctx.fillRect(40, size - 80, 40, 40)

        // Draw inner white squares
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(50, 50, 20, 20)
        ctx.fillRect(size - 70, 50, 20, 20)
        ctx.fillRect(50, size - 70, 20, 20)

        // Draw random dots to simulate QR code data
        ctx.fillStyle = "#000000"
        for (let i = 0; i < 100; i++) {
          const x = Math.floor(Math.random() * (size - 100)) + 50
          const y = Math.floor(Math.random() * (size - 100)) + 50
          const s = Math.floor(Math.random() * 10) + 5
          ctx.fillRect(x, y, s, s)
        }

        // Draw app URL text
        ctx.font = "12px Arial"
        ctx.fillText(value, size / 2 - 80, size - 10)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQRCode()
  }, [value, size])

  return <canvas ref={canvasRef} width={size} height={size} className="border rounded-lg" />
}
