import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET /api/categories/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: { books: true },
    })
    if (!category) return NextResponse.json({ error: "Ангилал олдсонгүй" }, { status: 404 })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 })
  }
}

// PUT /api/categories/:id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const category = await prisma.category.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Ангилал засахад алдаа гарлаа" }, { status: 500 })
  }
}

// DELETE /api/categories/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ message: "Ангилал устгагдлаа" })
  } catch {
    return NextResponse.json({ error: "Ангилал устгахад алдаа гарлаа" }, { status: 500 })
  }
}
