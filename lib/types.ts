export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
  reported: boolean
}

export interface App {
  id: string
  name: string
  version: string
  description: string
  size: string
  icon: string
  screenshots?: string[]
  changelog?: string[]
  uploadDate?: string
  rating?: number
  downloadUrl?: string
  videoPreview?: string
  developer?: string
  category?: string
  requirements?: string
  features?: string[]
  downloads?: number
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
  lastUpdated?: string
  isNew?: boolean
  installationType?: "apk" | "pwa" | "both"
  pwaUrl?: string
}
