import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNavigation from "@/components/bottom-navigation"
import StoreHeader from "@/components/store-header"
import { Chatbot } from "@/components/chatbot"
import { BuyMeCoffee } from "@/components/buy-me-coffee"
import { Toaster } from "@/components/ui/toaster"
import { PlayStoreInstallPrompt } from "@/components/play-store-install-prompt"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "UltraXas Store - Private App Store",
  description: "Private app store for UltraXas Dev team applications. Install and manage apps securely.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "UltraXas Store",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "UltraXas Store",
    title: "UltraXas Store - Private App Store",
    description: "Private app store for UltraXas Dev team applications",
  },
  twitter: {
    card: "summary",
    title: "UltraXas Store",
    description: "Private app store for UltraXas Dev team",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} dark theme-amoled`}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="UltraXas Store" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="UltraXas Store" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        {/* Google Fonts - Cookie font for Buy Me a Coffee button */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cookie&display=swap" rel="stylesheet" />

        {/* Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Enhanced Service Worker Registration for All Browsers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced Service Worker Registration for Cross-Browser Support
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none'
                  }).then(function(registration) {
                    console.log('✅ ServiceWorker registration successful with scope: ', registration.scope);
                    
                    // Force update check
                    registration.update();
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                      console.log('🔄 ServiceWorker: Update found');
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🆕 ServiceWorker: New content available');
                            // Optionally show update notification
                            if (window.showUpdateNotification) {
                              window.showUpdateNotification();
                            }
                          }
                        });
                      }
                    });
                  }, function(err) {
                    console.log('❌ ServiceWorker registration failed: ', err);
                  });
                });
              }

              // Enhanced PWA Install Prompt Handling for All Browsers
              let deferredPrompt;
              let installPromptShown = false;
              
              // Standard beforeinstallprompt event (Chrome, Edge)
              window.addEventListener('beforeinstallprompt', (e) => {
                console.log('🎯 PWA: beforeinstallprompt event fired');
                e.preventDefault();
                deferredPrompt = e;
                
                // Dispatch custom event to notify React components
                window.dispatchEvent(new CustomEvent('pwa-installable', { detail: e }));
                
                // Show install prompt after a delay if not shown yet
                if (!installPromptShown) {
                  setTimeout(() => {
                    if (!installPromptShown && deferredPrompt) {
                      console.log('🔔 Showing install prompt automatically');
                      window.dispatchEvent(new CustomEvent('pwa-auto-prompt'));
                    }
                  }, 5000); // Show after 5 seconds
                }
              });

              // App installed event
              window.addEventListener('appinstalled', (evt) => {
                console.log('🎉 PWA: App was installed');
                deferredPrompt = null;
                installPromptShown = true;
                
                // Dispatch custom event
                window.dispatchEvent(new CustomEvent('pwa-installed'));
              });

              // Safari/iOS specific handling
              function isIOS() {
                return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
              }

              function isInStandaloneMode() {
                return ('standalone' in window.navigator) && (window.navigator.standalone);
              }

              // Check if running as PWA
              function isPWA() {
                return window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone || 
                       document.referrer.includes('android-app://');
              }

              // Make functions available globally for React components
              window.getDeferredPrompt = () => deferredPrompt;
              window.clearDeferredPrompt = () => { 
                deferredPrompt = null; 
                installPromptShown = true;
              };
              window.isIOSDevice = isIOS;
              window.isStandalone = isInStandaloneMode;
              window.isPWAMode = isPWA;

              // Set default theme to AMOLED
              if (!localStorage.getItem('ultraxasTheme')) {
                localStorage.setItem('ultraxasTheme', 'amoled');
                document.documentElement.classList.add('dark', 'theme-amoled');
              }

              // Apply saved icon style
              const savedIcon = localStorage.getItem('ultraxasIconStyle');
              if (savedIcon) {
                // Apply icon style on load
                setTimeout(() => {
                  const event = new CustomEvent('apply-icon-style', { detail: savedIcon });
                  window.dispatchEvent(event);
                }, 100);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <StoreHeader />
          <main className="min-h-screen pb-16">{children}</main>
          <BottomNavigation />
          <Chatbot />
          <BuyMeCoffee />
          <PlayStoreInstallPrompt />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
