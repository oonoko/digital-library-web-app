"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Heart, Star, BookOpen, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Book, Category } from "@/lib/types"

const categoryColors: Record<string, string> = {
  fiction: "from-blue-500 to-blue-600",
  business: "from-orange-500 to-orange-600",
  "self-help": "from-purple-500 to-purple-600",
  history: "from-amber-500 to-amber-600",
  travel: "from-emerald-500 to-emerald-600",
  technology: "from-cyan-500 to-cyan-600",
  education: "from-indigo-500 to-indigo-600",
  children: "from-pink-500 to-pink-600",
}

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""

  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/books").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([booksData, catsData]) => {
      setBooks(booksData)
      setCategories(catsData)
      setLoading(false)
    })
  }, [])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory
        ? book.category?.slug === selectedCategory
        : true
      return matchesSearch && matchesCategory
    })
  }, [books, searchQuery, selectedCategory])

  const selectedCategoryName = categories.find((c) => c.slug === selectedCategory)?.name

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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Номын Каталог
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto">
                {selectedCategoryName
                  ? `${selectedCategoryName} ангиллын номнууд`
                  : "Бүх номнуудаас хайж, сонгон уншаарай"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto mt-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Номын нэр эсвэл зохиолчоор хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base bg-white border-0 shadow-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <aside className={`md:w-64 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
                <div className="glass-card rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground">Ангилал</h2>
                    {selectedCategory && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory("")}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Цэвэрлэх
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        !selectedCategory
                          ? "bg-[#0E4AA8] text-white"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      Бүгд ({books.length})
                    </button>

                    {categories.map((category) => {
                      const count = books.filter((b) => b.category?.slug === category.slug).length
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.slug)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                            selectedCategory === category.slug
                              ? "bg-[#0E4AA8] text-white"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span
                            className={`text-sm ${
                              selectedCategory === category.slug
                                ? "text-white/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </aside>

              {/* Books Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {loading ? "Ачааллаж байна..." : `${filteredBooks.length} ном олдлоо`}
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden animate-pulse border border-border/50">
                        <div className="aspect-[3/4] bg-muted" />
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredBooks.map((book, index) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/book/${book.id}`}>
                          <div className="group rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50">
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <Image
                                src={book.cover || "/placeholder.jpg"}
                                alt={book.title}
                                fill
                                className="object-cover group-hover:scale-103 transition-transform duration-500"
                              />
                              {/* Always visible overlay + button */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <Button size="sm" className="w-full bg-[#F26522] hover:bg-[#F26522]/90 text-white shadow-lg font-semibold">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Унших
                                </Button>
                              </div>
                              {/* Category Badge */}
                              <div className="absolute top-3 left-3">
                                <span
                                  className={`px-2 py-1 bg-gradient-to-r ${
                                    categoryColors[book.category?.slug] || "from-gray-500 to-gray-600"
                                  } text-white text-xs rounded-full`}
                                >
                                  {book.category?.name}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-[#0E4AA8] transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  {book.likes}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  {book.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ном олдсонгүй</h3>
                    <p className="text-muted-foreground">
                      Хайлтын үр дүн олдсонгүй. Өөр түлхүүр үгээр хайна уу.
                    </p>
                    <Button
                      onClick={() => { setSearchQuery(""); setSelectedCategory("") }}
                      className="mt-4 bg-[#0E4AA8] hover:bg-[#0E4AA8]/90 text-white"
                    >
                      Бүх номыг харах
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
