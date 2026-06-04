"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  BookOpen, Briefcase, Brain, Landmark, Globe, Laptop, GraduationCap, Baby, ArrowRight,
  Mic, Compass, Star,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Category, Book } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Briefcase, Brain, Landmark, Globe, Laptop, GraduationCap, Baby, Mic, Compass, Star,
  Globe2: Globe,
}

const colorMap: Record<string, string> = {
  "aman-zokhiol": "from-amber-500 to-amber-600",
  "mongol-uran-zokhiol": "from-blue-500 to-blue-600",
  "tanin-medekh": "from-purple-500 to-purple-600",
  "adal-yavdal": "from-orange-500 to-orange-600",
  "british-uran-zokhiol": "from-emerald-500 to-emerald-600",
  "gadaadiin-uran-zokhiol": "from-cyan-500 to-cyan-600",
  fiction: "from-blue-500 to-blue-600",
  business: "from-orange-500 to-orange-600",
  "self-help": "from-purple-500 to-purple-600",
  history: "from-amber-500 to-amber-600",
  travel: "from-emerald-500 to-emerald-600",
  technology: "from-cyan-500 to-cyan-600",
  education: "from-indigo-500 to-indigo-600",
  children: "from-pink-500 to-pink-600",
}

// Тоог 0-ээс target руу animate хийх hook
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || target === 0) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [authorCount, setAuthorCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/books").then((r) => r.json()),
    ]).then(([cats, bks]) => {
      setCategories(cats)
      setBooks(bks)
      // Жинхэнэ зохиолчийн тоог тооцоолох
      const uniqueAuthors = new Set((bks as Book[]).map((b) => b.author))
      setAuthorCount(uniqueAuthors.size)
      setLoading(false)
    })
  }, [])

  // Stats section харагдах үед animate эхлүүлэх
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const animatedBooks = useCountUp(books.length, 1200, statsVisible)
  const animatedCats = useCountUp(categories.length, 900, statsVisible)
  const animatedAuthors = useCountUp(authorCount, 1000, statsVisible)
  const animatedReaders = useCountUp(10000, 1800, statsVisible)

  const stats = [
    { label: "Нийт ном", value: animatedBooks, suffix: "+", color: "text-[#0E4AA8]" },
    { label: "Ангилал", value: animatedCats, suffix: "", color: "text-[#F26522]" },
    { label: "Зохиолч", value: animatedAuthors, suffix: "+", color: "text-purple-500" },
    { label: "Уншигч", value: animatedReaders >= 10000 ? "10K" : animatedReaders, suffix: "+", color: "text-emerald-500" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#0E4AA8] to-[#0a3a8a] py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Номын Ангилал</h1>
              <p className="text-white/70 max-w-2xl mx-auto">
                {categories.length} ангиллын {books.length}+ ном таныг хүлээж байна
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-48">
                    <div className="w-14 h-14 bg-muted rounded-xl mb-4" />
                    <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                  const IconComponent = iconMap[category.icon] || BookOpen
                  const bookCount = books.filter((b) => b.category?.slug === category.slug).length
                  const sampleBooks = books.filter((b) => b.category?.slug === category.slug).slice(0, 3)

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/catalog?category=${category.slug}`}>
                        <div className="group glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0E4AA8]/30 h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <div
                              className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${
                                colorMap[category.slug] || "from-gray-500 to-gray-600"
                              } flex items-center justify-center`}
                            >
                              <IconComponent className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-[#0E4AA8] transition-colors">
                                {category.name}
                              </h3>
                              <p className="text-muted-foreground text-sm">{bookCount} ном</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {sampleBooks.map((book) => (
                              <div key={book.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F26522]" />
                                <span className="truncate">{book.title}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 text-[#0E4AA8] font-medium text-sm group-hover:gap-3 transition-all">
                            <span>Бүгдийг харах</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-muted/30" ref={statsRef}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-1`}>
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
