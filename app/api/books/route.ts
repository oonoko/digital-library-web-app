import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET /api/books?category=fiction&search=монгол
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const books = await prisma.book.findMany({
      where: {
        ...(category && {
          category: { slug: category },
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(books)
  } catch {
    return NextResponse.json({ error: "Номнуудыг авахад алдаа гарлаа" }, { status: 500 })
  }
}

// POST /api/books - шинэ ном нэмэх
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, author, cover, description, pages, rating, content, categoryId } = body

    if (!title || !author || !categoryId) {
      return NextResponse.json({ error: "title, author, categoryId заавал шаардлагатай" }, { status: 400 })
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        cover: cover ?? "",
        description: description ?? "",
        pages: pages ?? 0,
        rating: rating ?? 0,
        content: content ?? [],
        categoryId,
      },
      include: { category: true },
    })
    return NextResponse.json(book, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Ном нэмэхэд алдаа гарлаа" }, { status: 500 })
  }
}
