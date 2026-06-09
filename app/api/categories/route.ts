import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET /api/categories - бүх ангиллыг авах
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: "Ангилал авахад алдаа гарлаа" }, { status: 500 })
  }
}

// POST /api/categories - шинэ ангилал үүсгэх
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, name, icon, count } = body

    if (!slug || !name || !icon) {
      return NextResponse.json({ error: "slug, name, icon заавал шаардлагатай" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { slug, name, icon, count: count ?? 0 },
    })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Ангилал үүсгэхэд алдаа гарлаа" }, { status: 500 })
  }
}
