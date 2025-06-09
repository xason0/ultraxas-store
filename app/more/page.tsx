"use client"

import { useState } from "react"
import { User, Settings, Palette, Globe, HelpCircle, Info, ChevronRight, Menu, Package, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function MorePage() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      section: "Account",
      items: [
        { name: "Profile", icon: User, href: "/profile", description: "Manage your profile" },
        { name: "Settings", icon: Settings, href: "/settings", description: "App preferences" },
      ],
    },
    {
      section: "Preferences",
      items: [
        { name: "Theme", icon: Palette, href: "/theme", description: "Dark/Light mode" },
        { name: "Language", icon: Globe, href: "/language", description: "English" },
      ],
    },
    {
      section: "Support",
      items: [
        { name: "Help Center", icon: HelpCircle, href: "/help", description: "Get help" },
        { name: "About UltraXas Store", icon: Info, href: "/about", description: "App info" },
      ],
    },
  ]

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">More</h1>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {menuItems.map((section, sectionIndex) => (
                <div key={section.section} className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                  {sectionIndex < menuItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop/Mobile Menu Items */}
      <div className="space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={section.section}>
            <h2 className="text-lg font-semibold mb-4 text-muted-foreground">{section.section}</h2>

            <div className="space-y-2">
              {section.items.map((item) => (
                <Card key={item.name} className="hover:shadow-md transition-shadow">
                  <Link href={item.href}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <CardDescription className="text-sm">{item.description}</CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>

            {sectionIndex < menuItems.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t">
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/upload">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Upload App</span>
            </Button>
          </Link>
          <Link href="/open-source">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
              <Code className="h-6 w-6" />
              <span className="text-sm">Browse Apps</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
