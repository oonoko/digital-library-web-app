import Image from "next/image"
import Link from "next/link"
import { Facebook, Phone, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0E4AA8] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Company Info */}
          <div className="md:col-span-2">
            <Image 
              src="/logo.png" 
              alt="Ханбогд Хурд" 
              width={200}
              height={80}
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-white/80 text-sm mt-2 max-w-md">
              Ханбогд Хурд ХХК - Хөгжлийн хурдаар тэргүүлнэ. Монголын тээврийн салбарт 
              шинэлэг үйлчилгээ үзүүлэгч компани.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Хурдан холбоос</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-[#F26522] transition-colors">
                  Нүүр хуудас
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-white/80 hover:text-[#F26522] transition-colors">
                  Номын каталог
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-white/80 hover:text-[#F26522] transition-colors">
                  Ангилал
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/80">
                <Phone className="h-4 w-4 text-[#F26522]" />
                <span>+976 88119221</span>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Facebook className="h-4 w-4 text-[#F26522]" />
                <a href="https://www.facebook.com/KhanbogdKhurd/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F26522] transition-colors">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Globe className="h-4 w-4 text-[#F26522]" />
                <a href="https://khanbogdkhurd.mn/en/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F26522] transition-colors">
                  khanbogdkhurd.mn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            Copyright &copy; 2026 Hanbogd Khurd Digital Library. All rights reserved.
          </p>
          <p className="text-white/60 text-sm">
            Хөгжлийн хурдаар тэргүүлнэ
          </p>
        </div>
      </div>
    </footer>
  )
}
