import { Code } from "lucide-react"

export function DeveloperFooter() {
  return (
    <div className="text-center py-4 text-xs text-muted-foreground mt-8 border-t">
      <div className="flex items-center justify-center gap-1 mb-1">
        <Code className="h-3 w-3" />
        <span>Developed by Manasseh Amoako</span>
      </div>
      <p>© 2025 UltraXas Dev</p>
    </div>
  )
}
