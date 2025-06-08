"use client"

import { Phone, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  const handleWhatsAppContact = () => {
    // Open WhatsApp without showing the number
    window.open("https://wa.me/447405817307?text=Hello%20UltraXas%20Team!", "_blank")
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">📞 Contact Us</h3>
            <p className="text-sm text-muted-foreground">For questions or feedback, message us directly:</p>
            <Button onClick={handleWhatsAppContact} variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>Contact us on WhatsApp</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
