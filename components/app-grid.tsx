import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Globe, Download } from "lucide-react"

interface App {
  id: string
  name: string
  description: string
  imageUrl: string
  rating: number
  installationType: "pwa" | "apk" | "both"
}

interface AppGridProps {
  apps: App[]
  isLoading?: boolean
}

export function AppGrid({ apps, isLoading }: AppGridProps) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading ? (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[300px]" />
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        apps.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={app.imageUrl || "/placeholder.svg"} />
                  <AvatarFallback>{app.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle>{app.name}</CardTitle>
                  {/* Add this after the app name and before the rating */}
                  <div className="flex items-center gap-1 mb-1">
                    {app.installationType === "pwa" && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        <Globe className="h-3 w-3 mr-1" />
                        PWA
                      </Badge>
                    )}
                    {app.installationType === "both" && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        <Download className="h-3 w-3 mr-1" />
                        APK
                      </Badge>
                    )}
                    {app.installationType === "both" && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        <Globe className="h-3 w-3 mr-1" />
                        PWA
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Rating: {app.rating}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>{app.description}</CardContent>
            <CardFooter className="justify-between">
              <Button>Install</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

// Export both named and default for compatibility
export default AppGrid
