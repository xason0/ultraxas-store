import Link from "next/link"
import { ChevronRight, Moon, Settings, User, HelpCircle, Info, Globe } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"

export default function MorePage() {
  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">More</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Account</h2>
          <div className="space-y-1">
            <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <span>Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Preferences</h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-primary" />
                <span>Theme</span>
              </div>
              <ModeToggle />
            </div>
            <Link href="/settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <span>Language</span>
              </div>
              <span className="text-sm text-muted-foreground">English</span>
            </Link>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Support</h2>
          <div className="space-y-1">
            <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Help Center</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <span>About UltraXas Store</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
