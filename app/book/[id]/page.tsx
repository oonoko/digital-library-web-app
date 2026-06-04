"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Star,
  BookOpen,
  Clock,
  Share2,
  MessageSquare,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/types"

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetch(`/api/books/${bookId}`)
      .then((r) => r.json())
      .then((data: Book) => {
        setBook(data)
        setLikeCount(data.likes)

        const likedBooks = JSON.parse(localStorage.getItem("likedBooks") || "[]")
        setIsLiked(likedBooks.includes(data.id))

        // Related books
        fetch(`/api/books?category=${data.category?.slug}`)
          .then((r) => r.json())
          .then((all: Book[]) => {
            setRelatedBooks(all.filter((b) => b.id !== data.id).slice(0, 4))
          })

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [bookId])

  const handleLike = async () => {
    if (!book) return

    const likedBooks = JSON.parse(localStorage.getItem("likedBooks") || "[]")

    if (isLiked) {
      await fetch(`/api/books/${book.id}/like`, { method: "DELETE" })
      const newLikedBooks = likedBooks.filter((id: string) => id !== book.id)
      localStorage.setItem("likedBooks", JSON.stringify(newLikedBooks))
      setLikeCount((c) => c - 1)
      setIsLiked(false)
    } else {
      await fetch(`/api/books/${book.id}/like`, { method: "POST" })
      likedBooks.push(book.id)
      localStorage.setItem("likedBooks", JSON.stringify(likedBooks))
      setLikeCount((c) => c + 1)
      setIsLiked(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded-2xl" />
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-5 bg-muted rounded w-1/3" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Ном олдсонгүй</h1>
            <Link href="/catalog">
              <Button className="bg-[#0E4AA8] hover:bg-[#0E4AA8]/90 text-white">
                Каталог руу буцах
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#0E4AA8] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Каталог руу буцах
            </Link>
          </div>
        </div>

        {/* Book Detail */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Cover */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-1"
              >
                <div className="sticky top-24">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={book.cover || "/placeholder.jpg"}
                      alt={book.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 transition-colors ${
                        isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      <span>{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span>{book.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span>{book.pages} хуудас</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-2"
              >
                <Link href={`/catalog?category=${book.category?.slug}`}>
                  <span className="inline-flex items-center px-3 py-1 bg-[#0E4AA8]/10 text-[#0E4AA8] rounded-full text-sm font-medium hover:bg-[#0E4AA8]/20 transition-colors">
                    {book.category?.name}
                  </span>
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">{book.author}</p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <Link href={`/read/${book.id}`}>
                    <Button size="lg" className="bg-[#F26522] hover:bg-[#F26522]/90 text-white">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Ном унших
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" onClick={handleLike}>
                    <Heart
                      className={`h-5 w-5 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {isLiked ? "Таалагдсан" : "Таалагдсан тэмдэглэх"}
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="h-5 w-5 mr-2" />
                    Хуваалцах
                  </Button>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Танилцуулга</h2>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <span className="text-sm text-muted-foreground">Хуудасны тоо</span>
                    <p className="font-semibold text-foreground">{book.pages}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <span className="text-sm text-muted-foreground">Ангилал</span>
                    <p className="font-semibold text-foreground">{book.category?.name}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Сэтгэгдэл</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Ном уншаад сэтгэгдэлээ үлдээгээрэй
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-foreground mb-6">Төстэй номнууд</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedBooks.map((relatedBook, index) => (
                  <motion.div
                    key={relatedBook.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={`/book/${relatedBook.id}`}>
                      <div className="group glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={relatedBook.cover || "/placeholder.jpg"}
                            alt={relatedBook.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-[#0E4AA8] transition-colors">
                            {relatedBook.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{relatedBook.author}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
