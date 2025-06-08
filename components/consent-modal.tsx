"use client"

import { useEffect, useState } from "react"
import { Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ConsentModal() {
  const [open, setOpen] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("ultraxasConsent") === "true"

    // Only show modal if user hasn't consented yet
    if (!hasConsented) {
      setOpen(true)
    }
  }, [])

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem("ultraxasConsent", "true")
    setOpen(false)
    setShowTerms(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300 consent-modal">
          <DialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="h-10 w-10 bg-gradient-to-br from-google-blue via-google-red to-google-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Welcome to UltraXas Store</DialogTitle>
            <DialogDescription className="text-center">
              Please review and accept our terms to continue
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <p className="font-medium">By using this platform, you agree to the following:</p>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>All apps available here are developed by the UltraXas team.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>You may download and test apps for personal or internal use only.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>We collect no personal data.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>UltraXas Dev is not responsible for any misuse of applications.</span>
              </li>
            </ul>

            <Separator />

            <p className="text-sm text-muted-foreground text-center">
              By clicking "I Accept," you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleAccept} className="w-full">
              I Accept & Continue
            </Button>
            <Button variant="link" size="sm" className="w-full" onClick={() => setShowTerms(true)}>
              <FileText className="h-3 w-3 mr-1" />
              View Full Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />📄 Terms of Use
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2 text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
              <p className="font-semibold text-center text-blue-800">
                🏢 This website was created by <span className="text-purple-700 font-bold">Manasseh Amoako</span>
                <br />
                CEO of UltraXas Developers
              </p>
            </div>

            <p className="font-medium">By using UltraXas Store:</p>

            <ul className="space-y-3 list-disc pl-5">
              <li>You agree not to redistribute or reverse-engineer any app.</li>
              <li>Apps are offered "as-is" without warranties.</li>
              <li>UltraXas Dev is not liable for any misuse or data loss.</li>
              <li>By accepting, you acknowledge these conditions and agree to our privacy policy.</li>
              <li>All intellectual property rights belong to UltraXas Developers and Manasseh Amoako.</li>
            </ul>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="creator">
                <AccordionTrigger>About the Creator</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Manasseh Amoako</strong> is the CEO and founder of UltraXas Developers, a leading mobile
                      app development company.
                    </p>
                    <p>
                      UltraXas Store was created to provide a platform for distributing high-quality Android
                      applications developed by the UltraXas team.
                    </p>
                    <p>All apps and content on this platform are the intellectual property of UltraXas Developers.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="privacy">
                <AccordionTrigger>Privacy Policy</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      UltraXas Store respects your privacy and does not collect personal information beyond what is
                      necessary for app functionality.
                    </p>
                    <p>We do not share your information with third parties.</p>
                    <p>App usage data may be collected anonymously for improving our services.</p>
                    <p>All data is processed in accordance with applicable privacy laws.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="usage">
                <AccordionTrigger>Usage Restrictions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Apps downloaded from UltraXas Store are for personal or internal use only.</p>
                    <p>Redistribution, decompilation, or reverse engineering of any app is strictly prohibited.</p>
                    <p>Violation may result in termination of access and legal action.</p>
                    <p>Commercial use requires explicit written permission from UltraXas Developers.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="liability">
                <AccordionTrigger>Limitation of Liability</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      UltraXas Dev and Manasseh Amoako are not responsible for any damages or losses resulting from the
                      use of our apps.
                    </p>
                    <p>We provide no warranties or guarantees regarding app functionality or performance.</p>
                    <p>Users assume all risks associated with downloading and using apps from UltraXas Store.</p>
                    <p>Maximum liability is limited to the amount paid for any premium services, if applicable.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleAccept} className="w-full">
              I Accept & Continue
            </Button>
            <Button variant="outline" onClick={() => setShowTerms(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
