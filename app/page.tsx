import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedBooksSection } from "@/components/home/featured-books-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedBooksSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
