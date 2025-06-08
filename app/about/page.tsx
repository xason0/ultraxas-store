import { Heart, Code, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">About</h1>
        <div className="text-right">
          <p className="text-sm font-medium flex">
            <span className="text-google-blue">U</span>
            <span className="text-google-red">l</span>
            <span className="text-google-yellow">t</span>
            <span className="text-google-blue">r</span>
            <span className="text-google-green">a</span>
            <span className="text-google-red">X</span>
            <span className="text-google-yellow">a</span>
            <span className="text-google-blue">s</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="relative h-16 w-16 bg-gradient-to-br from-google-blue via-google-red to-google-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h2 className="text-xl font-bold mb-2">UltraXas Store</h2>
          <p className="text-muted-foreground">Private app distribution for the UltraXas Dev team</p>
        </div>

        <div className="grid gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-google-blue/10 rounded-lg">
                <Shield className="h-5 w-5 text-google-blue" />
              </div>
              <h3 className="font-semibold">Secure & Private</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Exclusive access for UltraXas team members with secure app distribution.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-google-green/10 rounded-lg">
                <Code className="h-5 w-5 text-google-green" />
              </div>
              <h3 className="font-semibold">Developer Friendly</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Easy upload process with version control and changelog management.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-google-yellow/10 rounded-lg">
                <Zap className="h-5 w-5 text-google-yellow" />
              </div>
              <h3 className="font-semibold">Fast & Reliable</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Quick downloads with automatic redirects to ultraxas.com after installation.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-google-red/10 rounded-lg">
                <Heart className="h-5 w-5 text-google-red" />
              </div>
              <h3 className="font-semibold">Built with Love</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Crafted by the UltraXas team for seamless app distribution and testing.
            </p>
          </div>
        </div>

        <div className="text-center py-6 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Visit{" "}
            <a href="https://ultraxas.com" className="text-google-blue hover:underline">
              ultraxas.com
            </a>{" "}
            for more information
          </p>
          <p className="text-xs text-muted-foreground">UltraXas Store v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
