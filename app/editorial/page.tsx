import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function EditorialPage() {
  const articles = [
    {
      id: "1",
      title: "Top 10 Games of the Month",
      excerpt: "Check out our selection of the best mobile games released this month.",
      image: "/placeholder.svg?height=200&width=400&text=Top+Games",
      date: "June 5, 2025",
      category: "Gaming",
    },
    {
      id: "2",
      title: "Essential Productivity Apps for 2025",
      excerpt: "Boost your productivity with these must-have applications.",
      image: "/placeholder.svg?height=200&width=400&text=Productivity+Apps",
      date: "June 3, 2025",
      category: "Productivity",
    },
    {
      id: "3",
      title: "How to Secure Your Android Device",
      excerpt: "Follow these steps to keep your smartphone safe from threats.",
      image: "/placeholder.svg?height=200&width=400&text=Android+Security",
      date: "May 29, 2025",
      category: "Security",
    },
    {
      id: "4",
      title: "Best Photo Editing Apps for Social Media",
      excerpt: "Create stunning social media posts with these powerful editors.",
      image: "/placeholder.svg?height=200&width=400&text=Photo+Editing",
      date: "May 25, 2025",
      category: "Photography",
    },
  ]

  return (
    <div className="container max-w-lg mx-auto px-4 py-6">
      {/* Add UltraXas Store Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Editorial</h1>
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

      <div className="relative h-48 rounded-lg overflow-hidden mb-6">
        <Image
          src="/placeholder.svg?height=300&width=600&text=Mobile+Gaming+2025"
          alt="Featured article"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <span className="text-xs text-primary font-medium mb-1">Featured</span>
          <h2 className="text-xl font-bold text-white">The Future of Mobile Gaming in 2025</h2>
          <p className="text-sm text-white/80">Explore the upcoming trends in mobile gaming</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm whitespace-nowrap">All</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Gaming</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Productivity</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Security</div>
        <div className="px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap">Reviews</div>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <Link href="#" key={article.id}>
            <div className="flex flex-col sm:flex-row gap-4 group">
              <div className="relative h-40 sm:h-24 sm:w-24 rounded-lg overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs text-primary font-medium">{article.category}</span>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
            <Separator className="mt-6" />
          </Link>
        ))}
      </div>
    </div>
  )
}
