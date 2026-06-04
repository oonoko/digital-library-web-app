"use client"

import { motion } from "framer-motion"
import { Smartphone, QrCode, BookOpen, Wifi } from "lucide-react"

const steps = [
  {
    icon: Wifi,
    title: "Автобусанд сууна",
    description: "Ханбогд Хурд автобусанд суусан даруй WiFi-д холбогдоно",
  },
  {
    icon: QrCode,
    title: "QR код уншуулна",
    description: "Автобус дотор байрлах QR кодыг утсаараа уншуулна",
  },
  {
    icon: Smartphone,
    title: "Вэб руу орно",
    description: "Бүртгүүлэх шаардлагагүй, шууд номын санд хандана",
  },
  {
    icon: BookOpen,
    title: "Ном уншиж эхэлнэ",
    description: "Замдаа дуртай номоо сонгон уншиж цагаа өнгөрүүлнэ",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-[#0E4AA8] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#F26522]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Хэрхэн <span className="text-[#F26522]">ажилладаг</span> вэ?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Дөрвөн энгийн алхамаар замдаа ном уншиж эхлээрэй
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-white/20" />
              )}

              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                    <step.icon className="h-10 w-10 text-[#F26522]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F26522] text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
