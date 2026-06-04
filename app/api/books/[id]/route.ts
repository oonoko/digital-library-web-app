import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/books/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const book = await prisma.book.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!book) return NextResponse.json({ error: "Ном олдсонгүй" }, { status: 404 })
    return NextResponse.json(book)
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 })
  }
}

// PUT /api/books/:id - ном засах
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const book = await prisma.book.update({
      where: { id },
      data: body,
      include: { category: true },
    })
    return NextResponse.json(book)
  } catch {
    return NextResponse.json({ error: "Ном засахад алдаа гарлаа" }, { status: 500 })
  }
}

// DELETE /api/books/:id - ном устгах
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.book.delete({ where: { id } })
    return NextResponse.json({ message: "Ном устгагдлаа" })
  } catch {
    return NextResponse.json({ error: "Ном устгахад алдаа гарлаа" }, { status: 500 })
  }
}

// PATCH /api/books/:id/like - like нэмэх/хасах
