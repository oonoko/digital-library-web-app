"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/types"

export function FeaturedBooksSection() {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data: Book[]) => {
        // likes-аар эрэмбэлж, дээрхийг 4-ийг авна
        const sorted = [...data].sort((a, b) => b.likes - a.likes).slice(0, 4)
        setBooks(sorted)
      })
  }, [])

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Онцлох <span className="text-[#F26522]">Номнууд</span>
            </h2>
            <p className="text-muted-foreground">Хамгийн их уншигдаж буй номнуудаас сонгоорой</p>
          </div>
          <Link href="/catalog">
            <Button variant="outline" className="border-[#0E4AA8] text-[#0E4AA8] hover:bg-[#0E4AA8] hover:text-white">
              Бүх номыг үзэх
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {books.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            : books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/book/${book.id}`}>
                    <div className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={book.cover || "/placeholder.jpg"}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Button size="sm" className="w-full bg-[#F26522] hover:bg-[#F26522]/90 text-white shadow-lg font-semibold">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Унших
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-[#0E4AA8]/90 text-white text-xs rounded-full">
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
      </div>
    </section>
  )
}
