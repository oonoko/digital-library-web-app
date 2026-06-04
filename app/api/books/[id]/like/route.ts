import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/books/:id/like - like нэмэх
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const book = await prisma.book.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })
    return NextResponse.json({ likes: book.likes })
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 })
  }
}

// DELETE /api/books/:id/like - like хасах
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const book = await prisma.book.update({
      where: { id },
      data: { likes: { decrement: 1 } },
    })
    return NextResponse.json({ likes: book.likes })
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 })
  }
}
