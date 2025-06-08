import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import AppGrid from "@/components/app-grid"
import { apps } from "@/lib/data"

export default function GamesPage() {
  // Filter only games
  const games = apps.filter((app) => app.category === "Game")

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Add UltraXas Store Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Games</h1>
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

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search games..." className="pl-9" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm whitespace-nowrap">All Games</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Action</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Adventure</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Puzzle</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Strategy</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">RPG</div>
      </div>

      <div className="my-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-center text-muted-foreground">Advertisement</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Popular Games</h2>
      <AppGrid apps={games} />
    </div>
  )
}
