"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { X, Save, Trash, Download, Upload, Lock, ChevronRight, Shield, BarChart3, Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeSelector } from "@/components/theme-selector"
import { FontCustomization } from "@/components/font-customization"
import { IconCustomization } from "@/components/icon-customization"
import { InstallButton } from "@/components/install-button"
import { getStorageUsage, clearStorage, backupData, restoreData } from "@/lib/storage"
import { NavigationControls } from "@/components/navigation-controls"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 })
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminTab, setAdminTab] = useState("dashboard")
  const [backupStatus, setBackupStatus] = useState("")
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoUpdate: true,
    offlineMode: false,
    analytics: true,
    storeName: "UltraXas Store",
    storeDescription: "Private app store for UltraXas Dev team applications",
    contactEmail: "contact@ultraxas.com",
    contactPhone: "+233 20 000 0000",
    whatsappNumber: "+233200000000",
    githubUrl: "https://github.com/xason0",
    primaryColor: "#0070f3",
    secondaryColor: "#ff0080",
    backgroundColor: "#000000",
    fontPrimary: "Inter",
    fontSecondary: "System UI",
    iconStyle: "rounded",
    uploadPin: "1234",
    uploadEnabled: true,
    reviewsEnabled: true,
    ratingsEnabled: true,
    commentsEnabled: true,
    sharingEnabled: true,
    searchEnabled: true,
    filteringEnabled: true,
    sortingEnabled: true,
    categoriesEnabled: true,
    tagsEnabled: true,
    bookmarksEnabled: true,
    favoritesEnabled: true,
    countersEnabled: true,
    notificationsEnabled: true,
    analyticsEnabled: true,
    maintenanceMode: false,
    bannerMessage: "",
    backupFrequency: "weekly",
    dataRetention: 30,
    cookieConsent: true,
    ipLogging: false,
    userAgentTracking: true,
    performanceMode: "balanced",
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("ultraxasSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse settings:", e)
      }
    }

    // Check if admin session exists
    const adminSession = localStorage.getItem("ultraxasAdminSession")
    if (adminSession === "active") {
      setIsAdmin(true)
    }

    updateStorageUsage()
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("ultraxasSettings", JSON.stringify(settings))
  }, [settings])

  const updateStorageUsage = async () => {
    const usage = await getStorageUsage()
    setStorageUsage(usage)
  }

  const handleClearStorage = async () => {
    if (confirm("Are you sure you want to clear all storage? This will delete all apps, settings, and data.")) {
      await clearStorage()
      updateStorageUsage()
      toast({
        title: "Storage cleared",
        description: "All data has been removed from local storage.",
      })
    }
  }

  const handleBackup = async () => {
    setBackupStatus("Creating backup...")
    try {
      await backupData()
      setBackupStatus("Backup created successfully!")
      toast({
        title: "Backup created",
        description: "Your data has been backed up successfully.",
      })
    } catch (error) {
      setBackupStatus("Backup failed.")
      toast({
        title: "Backup failed",
        description: "There was an error creating your backup.",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async () => {
    if (!restoreFile) return

    setBackupStatus("Restoring data...")
    try {
      await restoreData(restoreFile)
      setBackupStatus("Data restored successfully!")
      toast({
        title: "Data restored",
        description: "Your data has been restored successfully.",
      })
      // Reload settings after restore
      const savedSettings = localStorage.getItem("ultraxasSettings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
      updateStorageUsage()
    } catch (error) {
      setBackupStatus("Restore failed.")
      toast({
        title: "Restore failed",
        description: "There was an error restoring your data.",
        variant: "destructive",
      })
    }
  }

  const handleAdminLogin = () => {
    // Simple admin password check - in a real app, use proper authentication
    if (adminPassword === "4933") {
      setIsAdmin(true)
      localStorage.setItem("ultraxasAdminSession", "active")
      toast({
        title: "Admin access granted",
        description: "You now have access to admin controls.",
      })
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect admin password.",
        variant: "destructive",
      })
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("ultraxasAdminSession")
    toast({
      title: "Logged out",
      description: "Admin session ended.",
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Apply certain settings immediately
    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", value)
    }

    toast({
      title: "Setting updated",
      description: `${key} has been updated.`,
    })
  }

  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-2">
          <NavigationControls />
          <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close settings">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isAdmin ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>Manage store settings and configuration</CardDescription>
                </div>
                <Badge variant="destructive">Admin</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dashboard" value={adminTab} onValueChange={setAdminTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="store">Store Config</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="ui">UI Design</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="backup">Backup</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Analytics Overview</h3>
                        <p className="text-sm text-muted-foreground">Store performance metrics</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Total Visits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">1,245</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Downloads</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">328</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Popular Apps</h3>
                      <div className="space-y-2">
                        {["Instagram", "Minecraft", "WhatsApp", "TikTok", "Spotify"].map((app, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <span>{app}</span>
                            <span className="text-sm text-muted-foreground">{100 - i * 15} downloads</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-muted-foreground">Temporarily disable the store</p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="store" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={settings.storeName}
                        onChange={(e) => handleSettingChange("storeName", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="storeDescription">Store Description</Label>
                      <Textarea
                        id="storeDescription"
                        value={settings.storeDescription}
                        onChange={(e) => handleSettingChange("storeDescription", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bannerMessage">Banner Message</Label>
                      <Input
                        id="bannerMessage"
                        value={settings.bannerMessage}
                        onChange={(e) => handleSettingChange("bannerMessage", e.target.value)}
                        placeholder="Special announcement or message"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto Updates</h3>
                        <p className="text-sm text-muted-foreground">Automatically update apps</p>
                      </div>
                      <Switch
                        checked={settings.autoUpdate}
                        onCheckedChange={(checked) => handleSettingChange("autoUpdate", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        value={settings.contactEmail}
                        onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={settings.contactPhone}
                        onChange={(e) => handleSettingChange("contactPhone", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                      <Input
                        id="whatsappNumber"
                        value={settings.whatsappNumber}
                        onChange={(e) => handleSettingChange("whatsappNumber", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="githubUrl"
                          value={settings.githubUrl}
                          onChange={(e) => handleSettingChange("githubUrl", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Reviews</h3>
                        <p className="text-sm text-muted-foreground">Enable app reviews</p>
                      </div>
                      <Switch
                        checked={settings.reviewsEnabled}
                        onCheckedChange={(checked) => handleSettingChange("reviewsEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Ratings</h3>
                        <p className="text-sm text-muted-foreground">Enable app ratings</p>
                      </div>
                      <Switch
                        checked={settings.ratingsEnabled}
                        onCheckedChange={(checked) => handleSettingChange("ratingsEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Comments</h3>
                        <p className="text-sm text-muted-foreground">Enable app comments</p>
                      </div>
                      <Switch
                        checked={settings.commentsEnabled}
                        onCheckedChange={(checked) => handleSettingChange("commentsEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Sharing</h3>
                        <p className="text-sm text-muted-foreground">Enable app sharing</p>
                      </div>
                      <Switch
                        checked={settings.sharingEnabled}
                        onCheckedChange={(checked) => handleSettingChange("sharingEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Search</h3>
                        <p className="text-sm text-muted-foreground">Enable app search</p>
                      </div>
                      <Switch
                        checked={settings.searchEnabled}
                        onCheckedChange={(checked) => handleSettingChange("searchEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Filtering</h3>
                        <p className="text-sm text-muted-foreground">Enable app filtering</p>
                      </div>
                      <Switch
                        checked={settings.filteringEnabled}
                        onCheckedChange={(checked) => handleSettingChange("filteringEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Categories</h3>
                        <p className="text-sm text-muted-foreground">Enable app categories</p>
                      </div>
                      <Switch
                        checked={settings.categoriesEnabled}
                        onCheckedChange={(checked) => handleSettingChange("categoriesEnabled", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Upload Enabled</h3>
                        <p className="text-sm text-muted-foreground">Allow users to upload apps</p>
                      </div>
                      <Switch
                        checked={settings.uploadEnabled}
                        onCheckedChange={(checked) => handleSettingChange("uploadEnabled", checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="uploadPin">Upload PIN</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="uploadPin"
                          type="password"
                          value={settings.uploadPin}
                          onChange={(e) => handleSettingChange("uploadPin", e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">PIN required to upload new apps</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto Approve</h3>
                        <p className="text-sm text-muted-foreground">Automatically approve uploads</p>
                      </div>
                      <Switch
                        checked={settings.autoUpdate}
                        onCheckedChange={(checked) => handleSettingChange("autoUpdate", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ui" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: settings.primaryColor }}
                        />
                        <Input
                          id="primaryColor"
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: settings.secondaryColor }}
                        />
                        <Input
                          id="secondaryColor"
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: settings.backgroundColor }}
                        />
                        <Input
                          id="backgroundColor"
                          type="text"
                          value={settings.backgroundColor}
                          onChange={(e) => handleSettingChange("backgroundColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Theme Selection</Label>
                      <ThemeSelector />
                    </div>

                    <div>
                      <Label>Font Customization</Label>
                      <FontCustomization />
                    </div>

                    <div>
                      <Label>Icon Style</Label>
                      <IconCustomization />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-medium mb-2">App Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Social", "Games", "Productivity", "Entertainment", "Utilities"].map((category, i) => (
                          <Badge key={i} variant="outline">
                            {category}
                          </Badge>
                        ))}
                        <Badge variant="outline">+ Add</Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Featured Apps</h3>
                      <div className="space-y-2">
                        {["Instagram", "Minecraft", "WhatsApp"].map((app, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <span>{app}</span>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          Add Featured App
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Editorial Content</h3>
                        <p className="text-sm text-muted-foreground">Show editorial section</p>
                      </div>
                      <Switch checked={true} onCheckedChange={(checked) => {}} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cookie Consent</h3>
                        <p className="text-sm text-muted-foreground">Show cookie consent banner</p>
                      </div>
                      <Switch
                        checked={settings.cookieConsent}
                        onCheckedChange={(checked) => handleSettingChange("cookieConsent", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">IP Logging</h3>
                        <p className="text-sm text-muted-foreground">Log user IP addresses</p>
                      </div>
                      <Switch
                        checked={settings.ipLogging}
                        onCheckedChange={(checked) => handleSettingChange("ipLogging", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">User Agent Tracking</h3>
                        <p className="text-sm text-muted-foreground">Track user browser info</p>
                      </div>
                      <Switch
                        checked={settings.userAgentTracking}
                        onCheckedChange={(checked) => handleSettingChange("userAgentTracking", checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dataRetention">Data Retention (days)</Label>
                      <Input
                        id="dataRetention"
                        type="number"
                        value={settings.dataRetention}
                        onChange={(e) => handleSettingChange("dataRetention", Number.parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">How long to keep user data</p>
                    </div>

                    <div>
                      <Label htmlFor="performanceMode">Performance Mode</Label>
                      <select
                        id="performanceMode"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={settings.performanceMode}
                        onChange={(e) => handleSettingChange("performanceMode", e.target.value)}
                      >
                        <option value="power-saver">Power Saver</option>
                        <option value="balanced">Balanced</option>
                        <option value="performance">Performance</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <select
                        id="backupFrequency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={settings.backupFrequency}
                        onChange={(e) => handleSettingChange("backupFrequency", e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button onClick={handleBackup} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Create Backup Now
                      </Button>

                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".json"
                          onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                        />
                        <Button onClick={handleRestore} disabled={!restoreFile} className="whitespace-nowrap">
                          <Upload className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                      </div>

                      {backupStatus && <p className="text-sm text-muted-foreground">{backupStatus}</p>}
                    </div>

                    <div>
                      <Button variant="destructive" onClick={handleClearStorage} className="flex items-center gap-2">
                        <Trash className="h-4 w-4" />
                        Clear All Data
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">This will delete all apps and settings</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleAdminLogout}>
                <Lock className="h-4 w-4 mr-2" />
                Exit Admin Mode
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the store looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Theme</h3>
                <ThemeSelector />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Font Size</h3>
                <FontCustomization />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">App Icon Style</h3>
                <IconCustomization />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>Install UltraXas Store as an app</CardDescription>
            </CardHeader>
            <CardContent>
              <InstallButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>Manage app storage and data (1TB Capacity)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Storage Usage</h3>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${storageUsage.percentage}%` }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {(storageUsage.used / 1024 / 1024).toFixed(2)} MB used of 1TB (1,024 GB)
                </p>
                <p className="text-xs text-green-600 mt-1">✅ Permanent storage with offline access</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleBackup} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Backup Data
                </Button>

                <div className="flex items-center gap-2">
                  <Input type="file" accept=".json" onChange={(e) => setRestoreFile(e.target.files?.[0] || null)} />
                  <Button onClick={handleRestore} disabled={!restoreFile} className="whitespace-nowrap">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </div>

                {backupStatus && <p className="text-sm text-muted-foreground">{backupStatus}</p>}
              </div>

              <Button variant="destructive" onClick={handleClearStorage} className="flex items-center gap-2">
                <Trash className="h-4 w-4" />
                Clear Storage
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>App information and credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">UltraXas Store</h3>
                <p className="text-sm text-muted-foreground">Version 3.0.0</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Developer</h3>
                <p className="text-sm text-muted-foreground">UltraXas Dev Team</p>
                <p className="text-sm text-muted-foreground">CEO: Manasseh Amoako</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/about">
                    About Us
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <a href="https://github.com/xason0" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter admin password to access admin controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <Button onClick={handleAdminLogin} className="whitespace-nowrap">
                  <Shield className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
