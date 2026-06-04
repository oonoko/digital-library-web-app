import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = "postgresql://postgres:@localhost:5432/digital_library"
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function main() {
  // 1. Бүх хуучин номыг устгах
  await prisma.book.deleteMany({})
  // 2. Бүх хуучин ангиллыг устгах
  await prisma.category.deleteMany({})
  console.log("🗑️  Хуучин өгөгдөл цэвэрлэгдлээ.")

  // 3. Шинэ 6 ангилал үүсгэх
  const categories = await Promise.all([
    prisma.category.create({
      data: { slug: "aman-zokhiol", name: "Аман зохиол", icon: "Mic", count: 0 },
    }),
    prisma.category.create({
      data: { slug: "mongol-uran-zokhiol", name: "Монгол уран зохиол", icon: "BookOpen", count: 0 },
    }),
    prisma.category.create({
      data: { slug: "tanin-medekh", name: "Танин мэдэхүй", icon: "Brain", count: 0 },
    }),
    prisma.category.create({
      data: { slug: "adal-yavdal", name: "Адал явдал", icon: "Compass", count: 0 },
    }),
    prisma.category.create({
      data: { slug: "british-uran-zokhiol", name: "Британийн уран зохиол", icon: "Globe", count: 0 },
    }),
    prisma.category.create({
      data: { slug: "gadaadiin-uran-zokhiol", name: "Гадаадын уран зохиол", icon: "Globe2", count: 0 },
    }),
  ])

  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.id]))
  console.log("✅ 6 ангилал үүсгэлээ.")

  // 4. Номнуудыг ангилалтай нь оруулах
  const books = [
    // ── Аман зохиол ──
    {
      title: "Монгол домог",
      author: "Х. Сампилдэндэв",
      cover: "/covers/mongol-domog.jpg",
      description: "Монгол ардын уламжлалт домог, үлгэрүүдийн цуглуулга.",
      pages: 180,
      likes: 134,
      rating: 4.7,
      epubFile: "Монгол домог .epub",
      categorySlug: "aman-zokhiol",
    },
    {
      title: "Гэсэр",
      author: "Ц. Дамдинсүрэн",
      cover: "/covers/geser.jpg",
      description: "Монгол, Төвдийн уламжлалт баатарлаг туульс.",
      pages: 320,
      likes: 215,
      rating: 4.9,
      epubFile: "Гэсэр .epub",
      categorySlug: "aman-zokhiol",
    },

    // ── Монгол уран зохиол ──
    {
      title: "Тунгалаг тамир 1",
      author: "Ч. Лодойдамба",
      cover: "/covers/tungalag-tamir-1.jpg",
      description: "Монголын алдарт зохиолч Д. Сэнгээгийн олон боть роман. 1-р дэвтэр.",
      pages: 290,
      likes: 267,
      rating: 4.8,
      epubFile: "Тунгалаг тамир 1.epub",
      categorySlug: "mongol-uran-zokhiol",
    },
    {
      title: "Тунгалаг тамир 2",
      author: "Ч. Лодойдамба",
      cover: "/covers/tungalag-tamir-2.jpg",
      description: "Монголын алдарт зохиолч Д. Сэнгээгийн олон боть роман. 2-р дэвтэр.",
      pages: 310,
      likes: 245,
      rating: 4.8,
      epubFile: "Тунгалаг тамир  2.epub",
      categorySlug: "mongol-uran-zokhiol",
    },
    {
      title: "Тунгалаг тамир 3",
      author: "Ч. Лодойдамба",
      cover: "/covers/tungalag-tamir-3.jpg",
      description: "Монголын алдарт зохиолч Д. Сэнгээгийн олон боть роман. 3-р дэвтэр.",
      pages: 298,
      likes: 231,
      rating: 4.7,
      epubFile: "Тунгалаг тамир  3.epub",
      categorySlug: "mongol-uran-zokhiol",
    },
    {
      title: "Тунгалаг тамир 4",
      author: "Ч. Лодойдамба",
      cover: "/covers/tungalag-tamir-4.jpg",
      description: "Монголын алдарт зохиолч Д. Сэнгээгийн олон боть роман. 4-р дэвтэр.",
      pages: 275,
      likes: 218,
      rating: 4.7,
      epubFile: "Тунгалаг тамир 4.epub",
      categorySlug: "mongol-uran-zokhiol",
    },
    {
      title: "Агуйгаас олдсон эрдэнэ",
      author: "Д. Наваансүрэн",
      cover: "/covers/aguigaas-oldson-erdene.jpg",
      description: "Агуйгаас олдсон эрдэнэ — Монгол уран зохиолын сонирхолтой бүтээл.",
      pages: 120,
      likes: 45,
      rating: 4.5,
      epubFile: "Агуйгаас олдсон эрдэнэ.epub",
      categorySlug: "mongol-uran-zokhiol",
    },
    {
      title: "Өвөл нахиалсан мөчир",
      author: "Т. Баасансүрэн",
      cover: "/covers/ovol-nakhialsan-mochir.jpg",
      description: "Өвөл нахиалсан мөчир — Монгол уран зохиолын лирик бүтээл.",
      pages: 145,
      likes: 89,
      rating: 4.5,
      epubFile: "Өвөл нахиалсан мөчир .epub",
      categorySlug: "mongol-uran-zokhiol",
    },
    {
      title: "Монголын нууц товчоо",
      author: "Ц. Дамдинсүрэн",
      cover: "/covers/mongolyn-nuuts-tovchoo.jpg",
      description: "Монголын хамгийн эртний, хамгийн чухал түүхэн дурсгалт бичиг.",
      pages: 380,
      likes: 342,
      rating: 5.0,
      epubFile: "Монголын нууц товчоо.epub",
      categorySlug: "mongol-uran-zokhiol",
    },

    // ── Танин мэдэхүй ──
    {
      title: "Ширээн дээрх нар",
      author: "М. Ильин",
      cover: "/covers/shireen-deerkh-nar.jpg",
      description: "Ширээн дээрх нар — танин мэдэхүйн чиглэлийн бүтээл.",
      pages: 192,
      likes: 97,
      rating: 4.5,
      epubFile: "Ширээн дээрх нар .epub",
      categorySlug: "tanin-medekh",
    },
    {
      title: "Амтат сайхан талх",
      author: "М. Ляшенко, А. Мусатов",
      cover: "/covers/amtat-saikhan-talkh.jpg",
      description: "Амтат сайхан талх — танин мэдэхүйн чиглэлийн дурсамж бүтээл.",
      pages: 80,
      likes: 54,
      rating: 4.4,
      epubFile: "Амтат сайхан талх.epub",
      categorySlug: "tanin-medekh",
    },

    // ── Адал явдал ──
    {
      title: "Шар нохой",
      author: "Жорж Сименон",
      cover: "/covers/shar-nokhoi.jpg",
      description: "Шар нохой — адал явдалт уран зохиолын бүтээл.",
      pages: 160,
      likes: 143,
      rating: 4.6,
      epubFile: "Шар нохой .epub",
      categorySlug: "adal-yavdal",
    },
    {
      title: "Дэлхийг тойрсон 80 хоног",
      author: "Жюль Верн",
      cover: "/covers/delkhiig-toirson-80.jpg",
      description: "Жюль Верны алдарт адал явдалт роман — Филеас Фогг дэлхийг 80 хоногт тойрно.",
      pages: 276,
      likes: 198,
      rating: 4.8,
      epubFile: "Дэлхийг тойрсон 80 хоног.epub",
      categorySlug: "adal-yavdal",
    },

    // ── Британийн уран зохиол ──
    {
      title: "Алга болсон захиа",
      author: "Артур Конан Дойл",
      cover: "/covers/alga-bolson-zakhia.jpg",
      description: "Алга болсон захиа — Британийн уран зохиолын орчуулга.",
      pages: 148,
      likes: 62,
      rating: 4.6,
      epubFile: "Алга болсон захиа .epub",
      categorySlug: "british-uran-zokhiol",
    },

    // ── Гадаадын уран зохиол ──
    {
      title: "Үүлэн бор",
      author: "Орос ардын үлгэр",
      cover: "/covers/uulen-bor.jpg",
      description: "Үүлэн бор — гадаадын уран зохиолын орчуулга.",
      pages: 175,
      likes: 112,
      rating: 4.6,
      epubFile: "Үүлэн бор.epub",
      categorySlug: "gadaadiin-uran-zokhiol",
    },
    {
      title: "Ах дүү арван хоёр",
      author: "Ц. Балдорж",
      cover: "/covers/akh-duu-arvan-khoyor.jpg",
      description: "Ах дүү арван хоёр — гадаадын уран зохиолын орчуулга.",
      pages: 110,
      likes: 71,
      rating: 4.5,
      epubFile: "Ах дүү арван хоёр .epub",
      categorySlug: "gadaadiin-uran-zokhiol",
    },
    {
      title: "Алтан үст охин",
      author: "Чех ардын үлгэр",
      cover: "/covers/altan-ust-okhin.jpg",
      description: "Алтан үст охин — гадаадын уран зохиолын орчуулга.",
      pages: 96,
      likes: 88,
      rating: 4.7,
      epubFile: "Алтан үст охин.epub",
      categorySlug: "gadaadiin-uran-zokhiol",
    },
  ]

  let addedCount = 0
  for (const { categorySlug, epubFile, ...rest } of books) {
    await prisma.book.create({
      data: {
        ...rest,
        content: [`/books hanbogd hurd/${epubFile}`],
        categoryId: cat[categorySlug],
      },
    })
    console.log(`✅ ${rest.title}`)
    addedCount++
  }

  // 5. Ангиллын count шинэчлэх
  for (const category of categories) {
    const count = await prisma.book.count({ where: { categoryId: category.id } })
    await prisma.category.update({ where: { id: category.id }, data: { count } })
  }

  console.log(`\n📚 Дууслаа: 6 ангилал, ${addedCount} ном амжилттай оруулагдлаа.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
