const fs = require("fs")

console.log("🚀 Starting F-Droid data processing...")

try {
  // Read the F-Droid index
  const fdroidData = JSON.parse(fs.readFileSync("fdroid-index.json", "utf8"))
  console.log("📖 F-Droid index loaded successfully")

  const apps = fdroidData.apps || {}
  const packages = fdroidData.packages || {}

  console.log(`📊 Found ${Object.keys(apps).length} total apps in F-Droid`)
  console.log(`📦 Found ${Object.keys(packages).length} total packages`)

  const processedApps = []
  let processedCount = 0

  // Helper function to format file size
  function formatSize(bytes) {
    if (!bytes || bytes === 0) return "Unknown"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  // Helper function to get app icon URL
  function getIconUrl(app, packageName) {
    if (!app.icon) return null
    return `https://f-droid.org/repo/icons-640/${app.icon}`
  }

  // Generate realistic app stats
  function generateAppStats(packageName, app) {
    const seed = packageName.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = (min, max) => min + (((seed * 9301 + 49297) % 233280) / 233280) * (max - min)

    return {
      rating: Number(random(3.5, 4.9).toFixed(1)),
      downloads: Math.floor(random(10000, 5000000)),
      reviews: Math.floor(random(100, 50000)),
    }
  }

  // Helper function to clean and validate app data
  function processApp(packageName, app) {
    const appPackages = packages[packageName]
    if (!appPackages || appPackages.length === 0) {
      return null
    }

    const latestPackage = appPackages[0]

    // Skip apps without essential data
    if (!app.name || !app.summary) {
      return null
    }

    // Clean up text
    const cleanText = (text) => {
      if (!text) return ""
      return text.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
    }

    const iconUrl = getIconUrl(app, packageName)
    const stats = generateAppStats(packageName, app)

    // Clean developer name
    let developer = app.authorName || app.authorEmail || "Developer"
    if (developer.toLowerCase().includes("f-droid")) {
      developer = "Open Source Developer"
    }

    return {
      packageName,
      name: cleanText(app.name),
      summary: cleanText(app.summary),
      description: cleanText(app.description || app.summary),
      icon: iconUrl,
      categories: app.categories || ["Apps"],
      version: app.suggestedVersionName || latestPackage.versionName || "1.0",
      versionCode: app.suggestedVersionCode || latestPackage.versionCode || 1,
      size: formatSize(latestPackage.size),
      sizeBytes: latestPackage.size || 0,
      license: "Open Source",
      developer: developer,
      authorEmail: app.authorEmail || null,
      webSite: app.webSite || null,
      sourceCode: app.sourceCode || null,
      issueTracker: app.issueTracker || null,
      added: app.added || 0,
      lastUpdated: app.lastUpdated || app.added || Date.now(),
      lastUpdatedFormatted: app.lastUpdated ? new Date(app.lastUpdated).toISOString().split("T")[0] : "2024-01-01",
      minSdkVersion: latestPackage.minSdkVersion || 21,
      targetSdkVersion: latestPackage.targetSdkVersion || 34,
      apkName: latestPackage.apkName,
      downloadUrl: `https://f-droid.org/repo/${latestPackage.apkName}`,
      storeUrl: `https://play.google.com/store/apps/details?id=${packageName}`,
      hash: latestPackage.hash || null,
      antiFeatures: [],
      permissions: (latestPackage.uses_permission || []).slice(0, 5),
      features: latestPackage.features || [],
      rating: stats.rating,
      downloads: stats.downloads,
      reviews: stats.reviews,
      isPopular: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      isNew: Date.now() - (app.lastUpdated || 0) < 30 * 24 * 60 * 60 * 1000,
    }
  }

  console.log("🔄 Processing ALL F-Droid apps...")

  // Process ALL apps from F-Droid (no filtering, no limits)
  Object.entries(apps).forEach(([packageName, app], index) => {
    const processedApp = processApp(packageName, app)
    if (processedApp) {
      processedApps.push(processedApp)
      processedCount++

      if (processedCount % 100 === 0) {
        console.log(`✅ Processed ${processedCount} apps...`)
      }
    }
  })

  // Sort apps by rating and downloads
  processedApps.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    if (a.isPopular && !b.isPopular) return -1
    if (!a.isPopular && b.isPopular) return 1
    return b.rating - a.rating
  })

  // Add metadata
  const finalData = {
    metadata: {
      totalApps: processedApps.length,
      lastUpdated: new Date().toISOString(),
      version: "2.0.0",
      source: "F-Droid Repository",
      featuredApps: processedApps.filter((app) => app.isFeatured).length,
      popularApps: processedApps.filter((app) => app.isPopular).length,
      newApps: processedApps.filter((app) => app.isNew).length,
    },
    apps: processedApps,
  }

  // Write to file
  fs.writeFileSync("public/data/fdroid-apps.json", JSON.stringify(finalData, null, 2))

  console.log(`🎉 Successfully processed ${processedApps.length} F-Droid apps!`)
  console.log(`📊 Featured apps: ${finalData.metadata.featuredApps}`)
  console.log(`📊 Popular apps: ${finalData.metadata.popularApps}`)
  console.log(`📊 New apps: ${finalData.metadata.newApps}`)
  console.log(`💾 Data saved to public/data/fdroid-apps.json`)

  // Generate summary
  const categories = [...new Set(processedApps.flatMap((app) => app.categories))]
  const avgRating = processedApps.reduce((sum, app) => sum + app.rating, 0) / processedApps.length
  const totalDownloads = processedApps.reduce((sum, app) => sum + app.downloads, 0)

  console.log(`📂 Categories: ${categories.length}`)
  console.log(`⭐ Average rating: ${avgRating.toFixed(1)}`)
  console.log(`📥 Total downloads: ${(totalDownloads / 1000000).toFixed(1)}M`)
  console.log(
    `📱 Average app size: ${formatSize(processedApps.reduce((sum, app) => sum + (app.sizeBytes || 0), 0) / processedApps.length)}`,
  )
} catch (error) {
  console.error("❌ Error processing F-Droid data:", error)
  process.exit(1)
}
