"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, BookOpen, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Sparkles,
    title: "AI Ном санал болгох",
    description: "Таны уншсан номууд дээр үндэслэн хиймэл оюун ухаан танд тохирсон номыг санал болгоно.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: BookOpen,
    title: "AI Товч агуулга",
    description: "Номын гол санааг автоматаар гаргаж, цаг хэмнэн уншихад тань туслана.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "AI Эшлэл гаргагч",
    description: "Номоос онцлох үг хэллэг, эшлэлүүдийг автоматаар таньж гаргана.",
    color: "from-orange-500 to-red-500",
  },
]

export function AIFeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F26522]/10 text-[#F26522] rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              AI Боломжууд
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Хиймэл оюун ухаанаар{" "}
              <span className="text-[#0E4AA8]">уншлагаа сайжруул</span>
            </h2>
            
            <p className="text-muted-foreground mb-8 text-lg">
              Орчин үеийн AI технологи ашиглан таны уншлагын туршлагыг илүү баялаг, 
              үр дүнтэй болгоно.
            </p>

            <Link href="/catalog">
              <Button className="bg-[#0E4AA8] hover:bg-[#0E4AA8]/90 text-white">
                AI боломжуудыг туршиx
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Right Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-[#0E4AA8]/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-[#0E4AA8] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
