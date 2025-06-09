"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Upload, File, X, Check, AlertTriangle, Eye, EyeOff, Lock, Video, Trash2, List } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { saveApp, deleteApp, getAllApps } from "@/lib/storage"
import type { App } from "@/lib/types"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authAttempts, setAuthAttempts] = useState(0)
  const [activeTab, setActiveTab] = useState("upload")

  // Upload form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: "",
    category: "apps",
    developer: "",
    size: "",
    requirements: "",
    features: "",
    installationType: "apk", // Add this new field
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // App management state
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDeleteApp, setConfirmDeleteApp] = useState<App | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Check admin authentication on component mount
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("ultraxas_admin_auth")
    if (adminAuth === "authenticated") {
      setIsAdminAuthenticated(true)
      loadApps()
    }
  }, [])

  const loadApps = async () => {
    setIsLoading(true)
    try {
      const allApps = await getAllApps()
      setApps(allApps)
    } catch (error) {
      console.error("Failed to load apps:", error)
      toast({
        title: "Error Loading Apps",
        description: "Failed to load apps from storage.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminAuth = () => {
    if (adminPassword === "4933") {
      setIsAdminAuthenticated(true)
      sessionStorage.setItem("ultraxas_admin_auth", "authenticated")
      setAdminPassword("")
      setAuthAttempts(0)
      loadApps()
      toast({
        title: "Admin Access Granted! 🔓",
        description: "You can now upload and manage APK files.",
      })
    } else {
      setAuthAttempts((prev) => prev + 1)
      setAdminPassword("")

      if (authAttempts >= 2) {
        toast({
          title: "Too Many Failed Attempts ⚠️",
          description: "Access temporarily restricted. Please try again later.",
          variant: "destructive",
        })
        setTimeout(() => setAuthAttempts(0), 30000) // Reset after 30 seconds
      } else {
        toast({
          title: "Access Denied ❌",
          description: `Incorrect password. ${2 - authAttempts} attempts remaining.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.name.endsWith(".apk")) {
        setSelectedFile(file)
        // Auto-fill some form data based on filename
        const nameFromFile = file.name.replace(".apk", "").replace(/[-_]/g, " ")
        setFormData((prev) => ({
          ...prev,
          name: prev.name || nameFromFile,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }))
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an APK file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate video file type
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid video file (MP4, WebM, MOV).",
          variant: "destructive",
        })
        return
      }

      // Check file size (max 100MB for video)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Video file must be smaller than 100MB.",
          variant: "destructive",
        })
        return
      }

      setVideoFile(file)

      // Create preview URL
      const videoUrl = URL.createObjectURL(file)
      setVideoPreviewUrl(videoUrl)

      toast({
        title: "Video Added! 🎬",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) added as preview.`,
      })
    }
  }

  const removeVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl)
    }
    setVideoPreviewUrl(null)
    setVideoFile(null)

    // Clear file input
    const videoInput = document.getElementById("video") as HTMLInputElement
    if (videoInput) {
      videoInput.value = ""
    }

    toast({
      title: "Video Removed",
      description: "App preview video has been removed.",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpload = async () => {
    if (!selectedFile || !formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter app name.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 200)

      // Convert APK file to base64 for storage
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string)
          } else {
            reject(new Error("Failed to read file"))
          }
        }
        reader.onerror = () => reject(new Error("File reading failed"))
        reader.readAsDataURL(selectedFile)
      })

      // Convert video file to base64 if present
      let videoData = null
      if (videoFile) {
        videoData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result) {
              resolve(reader.result as string)
            } else {
              reject(new Error("Failed to read video file"))
            }
          }
          reader.onerror = () => reject(new Error("Video file reading failed"))
          reader.readAsDataURL(videoFile)
        })
      }

      // Create app object
      const newApp: App = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || "No description provided",
        version: formData.version.trim() || "1.0.0",
        size: formData.size.trim() || "Unknown",
        icon: `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(formData.name.charAt(0).toUpperCase())}`,
        screenshots: [],
        changelog: [],
        uploadDate: new Date().toISOString(),
        rating: 0,
        downloadUrl: fileData,
        videoPreview: videoData,
        developer: formData.developer.trim() || "UltraXas Developers",
        category: formData.category,
        requirements: formData.requirements.trim() || "Android 5.0+",
        features: formData.features
          .trim()
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
        downloads: 0,
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        lastUpdated: new Date().toISOString(),
        isNew: true,
        installationType: formData.installationType,
      }

      // Save to storage with proper error handling
      try {
        await saveApp(newApp, selectedFile)
      } catch (storageError) {
        console.error("Storage error:", storageError)
        throw new Error("Failed to save app to storage")
      }

      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Upload Successful! 🎉",
        description: `${formData.name} has been uploaded successfully${videoFile ? " with video preview" : ""}.`,
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        version: "",
        category: "apps",
        developer: "",
        size: "",
        requirements: "",
        features: "",
        installationType: "apk",
      })
      setSelectedFile(null)
      setVideoFile(null)
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl)
        setVideoPreviewUrl(null)
      }
      setUploadProgress(0)

      // Clear file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
      fileInputs.forEach((input) => {
        input.value = ""
      })

      // Reload apps list
      loadApps()

      // Switch to manage tab
      setActiveTab("manage")
    } catch (error) {
      console.error("Upload error:", error)

      // Clear progress interval if it exists
      setUploadProgress(0)

      // Show specific error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

      toast({
        title: "Upload Failed",
        description: `Failed to upload the app: ${errorMessage}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteApp = async (app: App) => {
    setConfirmDeleteApp(app)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteApp) return

    try {
      await deleteApp(confirmDeleteApp.id)

      toast({
        title: "App Deleted",
        description: `${confirmDeleteApp.name} has been removed from the store.`,
      })

      // Reload apps list
      loadApps()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete the app. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setConfirmDeleteApp(null)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
  }

  // Admin authentication screen
  if (!isAdminAuthenticated) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Admin Access Required</h1>
        </div>

        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Restricted Area</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Admin Only:</strong> APK upload is restricted to administrators only. Please enter the admin
                password to continue.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  onKeyPress={(e) => e.key === "Enter" && handleAdminAuth()}
                  disabled={authAttempts >= 3}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {authAttempts > 0 && (
                <p className="text-sm text-red-600">
                  {authAttempts >= 3
                    ? "Too many failed attempts. Please wait 30 seconds."
                    : `${3 - authAttempts} attempts remaining`}
                </p>
              )}
            </div>

            <Button onClick={handleAdminAuth} className="w-full" disabled={!adminPassword.trim() || authAttempts >= 3}>
              <Lock className="h-4 w-4 mr-2" />
              Authenticate
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">Don't have admin access? Contact the administrator.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main upload interface (only shown to authenticated admins)
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage UltraXas Store apps</p>
          </div>
        </div>
        <Badge variant="destructive" className="text-xs">
          <Lock className="h-3 w-3 mr-1" />
          Admin Only
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload App
          </TabsTrigger>
          <TabsTrigger value="manage">
            <List className="h-4 w-4 mr-2" />
            Manage Apps
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "upload" && (
        <div className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Select APK File
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Choose APK File</h3>
                  <p className="text-muted-foreground mb-4">Select an Android APK file to upload</p>
                  <Input type="file" accept=".apk" onChange={handleFileSelect} className="max-w-xs mx-auto" />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                App Preview Video (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!videoFile ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Video className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Add Preview Video</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a short video showcasing your app (MP4, WebM, MOV - max 100MB)
                  </p>
                  <Input type="file" accept="video/*" onChange={handleVideoSelect} className="max-w-xs mx-auto" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Video className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{videoFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={removeVideo}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  {videoPreviewUrl && (
                    <div className="rounded-lg overflow-hidden border">
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full h-auto max-h-[300px]"
                        preload="metadata"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">App Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter app name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleInputChange("version", e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this app does..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apps">Apps</SelectItem>
                      <SelectItem value="games">Games</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="developer">Developer</Label>
                  <Input
                    id="developer"
                    value={formData.developer}
                    onChange={(e) => handleInputChange("developer", e.target.value)}
                    placeholder="UltraXas Developers"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="installationType">Installation Type</Label>
                <Select
                  value={formData.installationType}
                  onValueChange={(value) => handleInputChange("installationType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apk">APK Only</SelectItem>
                    <SelectItem value="pwa">PWA Only</SelectItem>
                    <SelectItem value="both">Both APK & PWA</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.installationType === "apk" && "Users can only download and install the APK file"}
                  {formData.installationType === "pwa" && "Users can only install as a Progressive Web App"}
                  {formData.installationType === "both" && "Users can choose between APK download or PWA installation"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">File Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    placeholder="25.5 MB"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Input
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="Android 5.0+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !formData.name.trim() || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload APK {videoFile && "+ Video"}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>

          {uploadProgress === 100 && (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> Your app has been uploaded successfully and is now available in the store.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {activeTab === "manage" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Manage Store Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading apps...</p>
                </div>
              ) : apps.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No apps in the store yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Upload your first app to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                          {app.icon ? (
                            <img
                              src={app.icon || "/placeholder.svg"}
                              alt={app.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <File className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>v{app.version}</span>
                            <span>•</span>
                            <span>{app.size}</span>
                            <span>•</span>
                            <span>{app.category}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteApp(app)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button variant="outline" onClick={loadApps} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Refresh App List
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete App</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete <strong>{confirmDeleteApp?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. The app will be permanently removed from the store.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
