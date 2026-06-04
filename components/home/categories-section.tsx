"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  BookOpen, Briefcase, Brain, Landmark, Globe, Laptop, GraduationCap, Baby, ArrowRight,
} from "lucide-react"
import type { Category } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Briefcase, Brain, Landmark, Globe, Laptop, GraduationCap, Baby,
}

const colorMap: Record<string, string> = {
  fiction: "from-blue-500 to-blue-600",
  business: "from-orange-500 to-orange-600",
  "self-help": "from-purple-500 to-purple-600",
  history: "from-amber-500 to-amber-600",
  travel: "from-emerald-500 to-emerald-600",
  technology: "from-cyan-500 to-cyan-600",
  education: "from-indigo-500 to-indigo-600",
  children: "from-pink-500 to-pink-600",
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Номын <span className="text-[#0E4AA8]">Ангилал</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Төрөл бүрийн сэдвээр ангилагдсан олон номноос сонгон уншаарай
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-6 bg-card border border-border animate-pulse h-32">
                  <div className="w-12 h-12 bg-muted rounded-xl mb-3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))
            : categories.map((category, index) => {
                const IconComponent = iconMap[category.icon] || BookOpen
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/catalog?category=${category.slug}`}>
                      <div className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border hover:border-[#0E4AA8]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#0E4AA8]/10">
                        <div
                          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${
                            colorMap[category.slug] || "from-gray-500 to-gray-600"
                          } mb-4`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-[#0E4AA8] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.count} ном</p>
                        <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-muted-foreground/50 group-hover:text-[#0E4AA8] group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
