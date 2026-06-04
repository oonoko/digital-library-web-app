import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs"
import JSZip from "jszip"

// GET /api/books/[id]/epub?chapter=0&meta=1
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const chapterIndex = parseInt(searchParams.get("chapter") || "0")
    const metaOnly = searchParams.get("meta") === "1"

    const book = await prisma.book.findUnique({ where: { id } })
    if (!book) return NextResponse.json({ error: "Ном олдсонгүй" }, { status: 404 })

    const epubRelPath = book.content[0]
    if (!epubRelPath || !epubRelPath.endsWith(".epub")) {
      return NextResponse.json({ error: "Epub файл байхгүй" }, { status: 404 })
    }

    const epubAbsPath = path.join(process.cwd(), epubRelPath)
    if (!fs.existsSync(epubAbsPath)) {
      return NextResponse.json({ error: "Epub файл олдсонгүй" }, { status: 404 })
    }

    const data = fs.readFileSync(epubAbsPath)
    const zip = await JSZip.loadAsync(data)

    // container.xml -с OPF файлын замыг авах
    let opfPath = "content.opf"
    const containerFile = zip.file("META-INF/container.xml")
    if (containerFile) {
      const containerXml = await containerFile.async("string")
      const match = containerXml.match(/full-path=["']([^"']+\.opf)["']/i)
      if (match) opfPath = match[1]
    }

    const opfFile = zip.file(opfPath)
    if (!opfFile) return NextResponse.json({ error: "OPF файл байхгүй" }, { status: 500 })
    const opfContent = await opfFile.async("string")

    // OPF subdir
    const opfDir = opfPath.includes("/") ? opfPath.substring(0, opfPath.lastIndexOf("/") + 1) : ""

    // spine-аас idref дарааллаар авах (single/double quote)
    const spineIds = [...opfContent.matchAll(/<itemref[^>]+idref=["']([^"']+)["']/g)].map((m) => m[1])

    // manifest: id -> href (attribute дараалал хоёр байж болно)
    const idToHref: Record<string, string> = {}
    for (const m of opfContent.matchAll(/<item\s[^>]+>/gi)) {
      const tag = m[0]
      const idMatch = tag.match(/\bid=["']([^"']+)["']/)
      const hrefMatch = tag.match(/\bhref=["']([^"']+)["']/)
      if (idMatch && hrefMatch) idToHref[idMatch[1]] = hrefMatch[1]
    }

    // spine дарааллаар html файлуудыг авах
    let chapterHrefs = spineIds
      .map((sid) => idToHref[sid])
      .filter((href): href is string => !!href && /\.(html|xhtml|htm)$/i.test(href))

    // Spine-аас олдохгүй бол epub дотрын index_split_*.html файлуудыг авах
    if (chapterHrefs.length === 0) {
      chapterHrefs = Object.keys(zip.files)
        .filter((f) => /index_split_\d+\.(html|xhtml)$/i.test(f))
        .sort()
    }

    if (chapterHrefs.length === 0) {
      return NextResponse.json({ error: "Бүлэг олдсонгүй" }, { status: 500 })
    }

    const totalChapters = chapterHrefs.length
    const safeIndex = Math.max(0, Math.min(chapterIndex, totalChapters - 1))

    // meta=1: зөвхөн бүлгийн тоо буцаана
    if (metaOnly) {
      return NextResponse.json({ totalChapters, title: book.title, author: book.author })
    }

    // Бүлгийн HTML файл унших
    const chapterHref = chapterHrefs[safeIndex]
    const chapterFile = zip.file(opfDir + chapterHref) || zip.file(chapterHref)
    if (!chapterFile) {
      return NextResponse.json({ error: `Бүлэг олдсонгүй: ${chapterHref}` }, { status: 500 })
    }
    let html = await chapterFile.async("string")

    // CSS унших
    const cssFile = zip.file(opfDir + "stylesheet.css") || zip.file("stylesheet.css")
    const pageCssFile = zip.file(opfDir + "page_styles.css") || zip.file("page_styles.css")
    let cssContent = ""
    if (cssFile) cssContent += await cssFile.async("string")
    if (pageCssFile) cssContent += await pageCssFile.async("string")

    // Зураг бүрийг base64 болгох — src, xlink:href, href attribute-уудыг бүгдийг шалгах
    const imgRegex = /(?:src|xlink:href|href)=["']([^"']+\.(jpe?g|png|gif|webp|svg))["']/gi
    const uniqueImgs = new Set([...html.matchAll(imgRegex)].map((m) => m[1]))
    for (const imgPath of uniqueImgs) {
      const imgFile = zip.file(opfDir + imgPath) || zip.file(imgPath)
      if (!imgFile) continue
      const imgData = await imgFile.async("base64")
      const ext = imgPath.split(".").pop()?.toLowerCase() || "png"
      const mime =
        ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
        ext === "svg" ? "image/svg+xml" :
        `image/${ext}`
      const dataUrl = `data:${mime};base64,${imgData}`
      // `"imgPath"` болон `'imgPath'` хоёуланг орлуулах
      html = html.replaceAll(`"${imgPath}"`, `"${dataUrl}"`).replaceAll(`'${imgPath}'`, `'${dataUrl}'`)
    }

    // Reader style inject
    const readerStyle = `<style id="__reader_style">
      ${cssContent}
      html, body {
        font-family: 'Georgia', 'Times New Roman', serif !important;
        font-size: 18px !important;
        line-height: 1.9 !important;
        padding: 32px 40px !important;
        max-width: 760px !important;
        margin: 0 auto !important;
        background: #f8f5f0 !important;
        color: #2c2416 !important;
        word-break: break-word !important;
      }
      img, svg { max-width: 100% !important; height: auto !important; display: block !important; margin: 1em auto !important; }
      svg image { max-width: 100% !important; }
      a { color: #0E4AA8 !important; text-decoration: none; }
      p { margin-bottom: 1em !important; }
    </style>`

    html = html
      .replace(/<link[^>]*(stylesheet|css)[^>]*>/gi, "")
      .replace(/<\/head>/i, `${readerStyle}\n</head>`)

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Chapter": safeIndex.toString(),
        "X-Total-Chapters": totalChapters.toString(),
        "Cache-Control": "private, max-age=300",
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Epub уншихад алдаа гарлаа" }, { status: 500 })
  }
}
