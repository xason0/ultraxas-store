"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Star,
  Calendar,
  HardDrive,
  FileCheck,
  AlertCircle,
  Play,
  ThumbsUp,
  Flag,
  User,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { enhancedStorage } from "@/lib/enhanced-storage"
import type { App, Review } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { PWAInstallButton } from "@/components/pwa-install-button"

interface AppWithFile extends App {
  apkFileId?: string
  hasApkFile?: boolean
}

export default function AppDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [app, setApp] = useState<AppWithFile | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    const loadApp = async () => {
      try {
        const apps = await enhancedStorage.getApps()
        const foundApp = apps.find((app) => app.id === params.id)
        if (foundApp) {
          setApp(foundApp)
          setReviews(foundApp.reviews || [])
        } else {
          setApp(null)
        }
      } catch (error) {
        console.error("Error loading app:", error)
        setApp(null)
      }
    }

    loadApp()
  }, [params.id])

  const handleDownload = async () => {
    if (!app?.downloadUrl) {
      toast({
        title: "No APK Available",
        description: "This app doesn't have an APK file for download.",
        variant: "destructive",
      })
      return
    }

    setDownloading(true)

    try {
      toast({
        title: "Preparing Download... 📦",
        description: `Getting ${app.name} ready for download...`,
      })

      // Create download link
      const link = document.createElement("a")
      link.href = app.downloadUrl
      link.download = `${app.name}_v${app.version}.apk`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Update download count
      const updatedApp = { ...app, downloads: (app.downloads || 0) + 1 }
      await enhancedStorage.updateApp(app.id, updatedApp)
      setApp(updatedApp)

      // Track download in analytics
      try {
        const downloads = JSON.parse(localStorage.getItem("ultraxas_analytics_downloads") || "[]")
        downloads.push({
          appId: app.id,
          appName: app.name,
          date: new Date().toISOString().split("T")[0],
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem("ultraxas_analytics_downloads", JSON.stringify(downloads))
      } catch (error) {
        console.error("Failed to track download:", error)
      }

      toast({
        title: "Download Started! ✅",
        description: `${app.name} APK is downloading to your device.`,
      })

      // Show installation instructions
      setTimeout(() => {
        setInstalling(true)
      }, 1000)
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed ❌",
        description: "Failed to download the APK file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleInstall = () => {
    toast({
      title: "Installation Guide 📱",
      description: "Check your Downloads folder and tap the APK file to install. Enable 'Unknown Sources' if prompted.",
    })
  }

  const submitReview = async () => {
    if (!userRating || !userReview.trim()) {
      toast({
        title: "Incomplete Review",
        description: "Please provide both a rating and a comment.",
        variant: "destructive",
      })
      return
    }

    setSubmittingReview(true)

    try {
      const newReview: Review = {
        id: Date.now().toString(),
        userId: "user_" + Date.now(),
        userName: "Anonymous User",
        rating: userRating,
        comment: userReview.trim(),
        date: new Date().toISOString(),
        helpful: 0,
        reported: false,
      }

      const updatedReviews = [...reviews, newReview]
      const averageRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length
      const totalReviews = updatedReviews.length

      const updatedApp = {
        ...app!,
        reviews: updatedReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      }

      await enhancedStorage.updateApp(app!.id, updatedApp)
      setApp(updatedApp)
      setReviews(updatedReviews)
      setUserRating(0)
      setUserReview("")

      toast({
        title: "Review Submitted! ⭐",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const markHelpful = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review,
      )

      const updatedApp = { ...app!, reviews: updatedReviews }
      await enhancedStorage.updateApp(app!.id, updatedApp)
      setReviews(updatedReviews)
      setApp(updatedApp)

      toast({
        title: "Marked as Helpful! 👍",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error marking helpful:", error)
    }
  }

  const reportReview = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.map((review) => (review.id === reviewId ? { ...review, reported: true } : review))

      const updatedApp = { ...app!, reviews: updatedReviews }
      await enhancedStorage.updateApp(app!.id, updatedApp)
      setReviews(updatedReviews)
      setApp(updatedApp)

      toast({
        title: "Review Reported 🚩",
        description: "Thank you for reporting inappropriate content.",
      })
    } catch (error) {
      console.error("Error reporting review:", error)
    }
  }

  if (!app) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-muted-foreground text-lg">App not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-20">
      <Button variant="ghost" size="icon" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-start gap-4 mb-6">
        <div className="relative h-20 w-20 rounded-2xl overflow-hidden">
          <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{app.name}</h1>
          <p className="text-sm text-muted-foreground mb-2">by {app.developer || "UltraXas Dev Team"}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(app.averageRating || 0) ? "fill-primary text-primary" : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm">{app.averageRating?.toFixed(1) || "No ratings"}</span>
            <span className="text-sm text-muted-foreground">({app.totalReviews || 0})</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>v{app.version}</span>
            </div>
            <div className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              <span>{app.size}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{app.downloads || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview */}
      {app.videoPreview && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="relative rounded-lg overflow-hidden">
              <video
                src={app.videoPreview}
                controls
                className="w-full h-auto max-h-[300px]"
                preload="metadata"
                poster={app.icon}
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  Preview
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Status Alert */}
      {app.downloadUrl ? (
        <Alert className="mb-6">
          <FileCheck className="h-4 w-4" />
          <AlertDescription>
            <strong>APK Available:</strong> This app is ready for download and installation.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>No APK File:</strong> This app doesn't have an APK file available for download.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        {/* APK Download Button */}
        {(app.installationType === "apk" || app.installationType === "both") && (
          <Button className="w-full" onClick={handleDownload} disabled={downloading || !app.downloadUrl}>
            {downloading ? (
              "Preparing Download..."
            ) : app.downloadUrl ? (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download APK ({app.size})
              </>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                No APK Available
              </>
            )}
          </Button>
        )}

        {/* PWA Install Button */}
        {(app.installationType === "pwa" || app.installationType === "both") && (
          <PWAInstallButton
            appName={app.name}
            appUrl={app.pwaUrl || window.location.origin}
            onInstallSuccess={() => {
              // Update download count for PWA installs too
              const updatedApp = { ...app, downloads: (app.downloads || 0) + 1 }
              enhancedStorage.updateApp(app.id, updatedApp)
              setApp(updatedApp)
            }}
          />
        )}

        {/* Installation Guide Button */}
        {installing && (
          <Button variant="outline" onClick={handleInstall} className="w-full">
            <FileCheck className="mr-2 h-4 w-4" />
            Installation Guide
          </Button>
        )}

        {/* Installation Type Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {app.installationType === "apk" && "APK Download Only"}
            {app.installationType === "pwa" && "PWA Installation Only"}
            {app.installationType === "both" && "APK & PWA Available"}
          </Badge>
        </div>
      </div>

      {/* Installation Instructions */}
      {installing && (
        <Alert className="mb-6">
          <FileCheck className="h-4 w-4" />
          <AlertDescription>
            <strong>Installation Steps:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
              <li>Open your device's Downloads folder</li>
              <li>Tap on the downloaded APK file</li>
              <li>Enable "Install from Unknown Sources" if prompted</li>
              <li>Follow the installation prompts</li>
              <li>Launch the app from your app drawer</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="about">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({app.totalReviews || 0})</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{app.description}</p>
            </div>

            {app.features && app.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {app.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Developer</h3>
              <Badge variant="secondary">{app.developer || "UltraXas Dev Team"}</Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <p className="text-sm text-muted-foreground">{app.requirements || "Android 5.0+"}</p>
            </div>

            {app.uploadDate && (
              <div>
                <h3 className="font-semibold mb-2">Release Date</h3>
                <p className="text-sm text-muted-foreground">{new Date(app.uploadDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {/* Rating Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{app.averageRating?.toFixed(1) || "0.0"}</div>
                    <div className="flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(app.averageRating || 0)
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{app.totalReviews || 0} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((r) => r.rating === rating).length
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <span className="text-sm w-3">{rating}</span>
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Write Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => setUserRating(rating)}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= userRating ? "fill-primary text-primary" : "fill-muted text-muted"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Share your experience with this app..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button onClick={submitReview} disabled={submittingReview || !userRating || !userReview.trim()}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => markHelpful(review.id)}>
                              <ThumbsUp className="h-3 w-3 mr-2" />
                              Helpful ({review.helpful})
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => reportReview(review.id)}>
                              <Flag className="h-3 w-3 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                    {review.helpful > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {review.helpful} people found this helpful
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {reviews.length > 3 && !showAllReviews && (
                <Button variant="outline" onClick={() => setShowAllReviews(true)} className="w-full">
                  Show All Reviews ({reviews.length})
                </Button>
              )}

              {reviews.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-muted-foreground">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">Be the first to review this app!</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="screenshots">
          <div className="space-y-4">
            {app.screenshots && app.screenshots.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {app.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative h-[400px] rounded-lg overflow-hidden">
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt={`${app.name} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📸</div>
                <p className="text-muted-foreground">No screenshots available</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
