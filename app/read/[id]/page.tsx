"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, ChevronLeft, ChevronRight, Sun, Moon,
  Bookmark, Maximize, Minimize, Home, Menu, X, Heart,
  MessageSquare, Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Book, Comment } from "@/lib/types"

export default function ReadBookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [book, setBook] = useState<Book | null>(null)
  const [chapterHtml, setChapterHtml] = useState("")
  const [totalChapters, setTotalChapters] = useState(1)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chapterLoading, setChapterLoading] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentName, setCommentName] = useState("")
  const [showComments, setShowComments] = useState(false)

  // Reader styles — dark/light + font size
  const readerStyle = `
    <style id="__rs">
      html, body {
        font-size: ${fontSize}px !important;
        font-family: 'Georgia', 'Times New Roman', serif !important;
        line-height: 1.9 !important;
        background: ${isDarkMode ? "#1a1a2e" : "#f8f5f0"} !important;
        color: ${isDarkMode ? "#e8dfc8" : "#2c2416"} !important;
        padding: 32px 40px !important;
        max-width: 760px !important;
        margin: 0 auto !important;
        word-break: break-word !important;
      }
      img { max-width: 100% !important; height: auto !important; display: block; margin: 1em auto; }
      a { color: ${isDarkMode ? "#7aafff" : "#0E4AA8"} !important; text-decoration: none; }
      p { margin-bottom: 1em !important; }
    </style>
  `

  // HTML fetch + style inject
  const loadChapter = useCallback(async (id: string, chapter: number) => {
    setChapterLoading(true)
    try {
      const res = await fetch(`/api/books/${id}/epub?chapter=${chapter}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      let html = await res.text()
      // inject reader style after <head>
      html = html.replace(/<head([^>]*)>/i, `<head$1>${readerStyle}`)
      setChapterHtml(html)
      setCurrentChapter(chapter)
      localStorage.setItem(`book-chapter-${id}`, chapter.toString())
    } catch (e) {
      console.error("loadChapter error:", e)
      setChapterHtml(`<html><body style="padding:2rem;font-family:sans-serif;color:red">
        Бүлэг ачаалахад алдаа гарлаа. Хуудсыг дахин ачааллана уу.
      </body></html>`)
    } finally {
      setChapterLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, fontSize])

  const [showOnboarding, setShowOnboarding] = useState(false)

  // Эхний ачаалалт
  useEffect(() => {
    Promise.all([
      fetch(`/api/books/${bookId}`).then((r) => r.json()),
      fetch(`/api/books/${bookId}/epub?meta=1`).then((r) => r.json()),
    ])
      .then(([bookData, meta]: [Book, { totalChapters: number }]) => {
        setBook(bookData)
        setLikeCount(bookData.likes)
        const total = meta.totalChapters || 1
        setTotalChapters(total)

        const savedChapter = Math.min(
          parseInt(localStorage.getItem(`book-chapter-${bookData.id}`) || "0"),
          total - 1
        )

        const savedDark = localStorage.getItem("reader-dark-mode")
        if (savedDark) setIsDarkMode(savedDark === "true")
        const savedFont = localStorage.getItem("reader-font-size")
        if (savedFont) setFontSize(parseInt(savedFont))

        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
        setIsBookmarked(bookmarks.includes(bookData.id))
        const liked = JSON.parse(localStorage.getItem("likedBooks") || "[]")
        setIsLiked(liked.includes(bookData.id))
        const stored = localStorage.getItem(`book-comments-${bookData.id}`)
        if (stored) setComments(JSON.parse(stored))

        setLoading(false)
        loadChapter(bookData.id, savedChapter)

        // Анх удаа нээж байвал онбординг харуулах
        const hasSeenOnboarding = localStorage.getItem("reader-onboarding-seen")
        if (!hasSeenOnboarding) setShowOnboarding(true)
      })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Dark mode / font size өөрчлөгдөхөд бүлгийг дахин ачаалах
  useEffect(() => {
    if (!book || loading) return
    loadChapter(book.id, currentChapter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, fontSize])

  // localStorage хадгалах
  useEffect(() => {
    localStorage.setItem("reader-dark-mode", isDarkMode.toString())
    localStorage.setItem("reader-font-size", fontSize.toString())
  }, [isDarkMode, fontSize])

  // iframe ачаалах үед дээш гүйлгэх
  const handleIframeLoad = () => {
    try {
      iframeRef.current?.contentWindow?.scrollTo(0, 0)
    } catch {}
  }

  const goToChapter = (ch: number) => {
    if (!book || ch < 0 || ch >= totalChapters || chapterLoading) return
    loadChapter(book.id, ch)
  }

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const toggleBookmark = () => {
    if (!book) return
    const bm = JSON.parse(localStorage.getItem("bookmarks") || "[]")
    if (isBookmarked) {
      localStorage.setItem("bookmarks", JSON.stringify(bm.filter((id: string) => id !== book.id)))
    } else {
      bm.push(book.id)
      localStorage.setItem("bookmarks", JSON.stringify(bm))
    }
    setIsBookmarked(!isBookmarked)
  }

  const toggleLike = async () => {
    if (!book) return
    const liked = JSON.parse(localStorage.getItem("likedBooks") || "[]")
    if (isLiked) {
      await fetch(`/api/books/${book.id}/like`, { method: "DELETE" })
      localStorage.setItem("likedBooks", JSON.stringify(liked.filter((id: string) => id !== book.id)))
      setLikeCount((c) => c - 1)
    } else {
      await fetch(`/api/books/${book.id}/like`, { method: "POST" })
      liked.push(book.id)
      localStorage.setItem("likedBooks", JSON.stringify(liked))
      setLikeCount((c) => c + 1)
    }
    setIsLiked(!isLiked)
  }

  const addComment = () => {
    if (!book || !newComment.trim()) return
    const c: Comment = {
      id: Date.now().toString(),
      name: commentName.trim() || "Зочин",
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    }
    const updated = [...comments, c]
    setComments(updated)
    localStorage.setItem(`book-comments-${book.id}`, JSON.stringify(updated))
    setNewComment("")
    setCommentName("")
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToChapter(currentChapter - 1)
      else if (e.key === "ArrowRight") goToChapter(currentChapter + 1)
      else if (e.key === "Escape") { setShowMenu(false); setShowComments(false) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter, totalChapters])

  const progress = totalChapters > 1 ? ((currentChapter + 1) / totalChapters) * 100 : 100

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#1a1a2e]" : "bg-[#f8f5f0]"}`}>
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0E4AA8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Ном ачааллаж байна...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ном олдсонгүй</h1>
          <Link href="/catalog">
            <Button className="bg-[#0E4AA8] hover:bg-[#0E4AA8]/90 text-white">Каталог руу буцах</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-[#1a1a2e] text-gray-100" : "bg-[#f8f5f0] text-gray-900"}`}>

      {/* Top Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? "bg-[#16213e]/95 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm shadow-sm"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => router.back()} className={`shrink-0 p-2 rounded-lg ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="hidden sm:block min-w-0">
                <h1 className="font-semibold truncate max-w-[220px] md:max-w-[360px]">{book.title}</h1>
                <p className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{book.author}</p>
              </div>
            </div>

            <span className={`text-sm font-medium tabular-nums ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
              {currentChapter + 1}-р бүлэг / {totalChapters} бүлэг
            </span>

            <button onClick={() => { setShowMenu(!showMenu); setShowComments(false) }} className={`shrink-0 p-2 rounded-lg ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className={`h-0.5 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
          <div className="h-full bg-[#0E4AA8] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Settings Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`fixed top-16 right-4 z-50 p-4 rounded-2xl shadow-xl border w-56 ${isDarkMode ? "bg-[#16213e] border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Харанхуй горим</span>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg ${isDarkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"}`}>
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
              <div>
                <p className="text-sm mb-2">Үсгийн хэмжээ: {fontSize}px</p>
                <div className="flex gap-2">
                  <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>А-</button>
                  <button onClick={() => setFontSize(Math.min(30, fontSize + 2))} className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>А+</button>
                </div>
              </div>
              <button onClick={toggleBookmark} className={`w-full flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${isBookmarked ? "text-[#F26522]" : ""}`}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                <span className="text-sm">{isBookmarked ? "Хадгалсан" : "Хадгалах"}</span>
              </button>
              <button onClick={toggleFullscreen} className={`w-full flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="text-sm">{isFullscreen ? "Жижиг дэлгэц" : "Бүтэн дэлгэц"}</span>
              </button>
              <Link href="/">
                <button className={`w-full flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Нүүр хуудас</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Reader */}
      <main className="flex-1 pt-14 pb-20 relative">
        {chapterLoading && (
          <div className={`absolute inset-0 z-10 flex items-center justify-center ${isDarkMode ? "bg-[#1a1a2e]/80" : "bg-[#f8f5f0]/80"}`}>
            <div className="w-8 h-8 border-4 border-[#0E4AA8] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <iframe
          ref={iframeRef}
          srcDoc={chapterHtml}
          onLoad={handleIframeLoad}
          className="w-full border-none"
          style={{ height: "calc(100vh - 8.5rem)", background: isDarkMode ? "#1a1a2e" : "#f8f5f0" }}
          title={`${book.title} — ${currentChapter + 1}`}
        />
      </main>

      {/* Bottom Navigation */}
      <footer className={`fixed bottom-0 left-0 right-0 z-40 ${isDarkMode ? "bg-[#16213e]/95 backdrop-blur-sm border-t border-gray-700" : "bg-white/95 backdrop-blur-sm shadow-[0_-1px_8px_rgba(0,0,0,0.08)]"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-2">
            <button
              onClick={() => goToChapter(currentChapter - 1)}
              disabled={currentChapter === 0 || chapterLoading}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Өмнөх</span>
            </button>

            {/* Chapter dots */}
            <div className="flex-1 flex items-center justify-center gap-1.5 overflow-hidden px-2">
              {(() => {
                const visible = Math.min(9, totalChapters)
                const half = Math.floor(visible / 2)
                const start = Math.max(0, Math.min(currentChapter - half, totalChapters - visible))
                return Array.from({ length: visible }, (_, i) => {
                  const ch = start + i
                  return (
                    <button
                      key={ch}
                      onClick={() => goToChapter(ch)}
                      className={`rounded-full transition-all duration-200 ${ch === currentChapter ? "w-5 h-2.5 bg-[#0E4AA8]" : `w-2 h-2 ${isDarkMode ? "bg-gray-600 hover:bg-gray-400" : "bg-gray-300 hover:bg-gray-500"}`}`}
                    />
                  )
                })
              })()}
            </div>

            <button
              onClick={() => goToChapter(currentChapter + 1)}
              disabled={currentChapter >= totalChapters - 1 || chapterLoading}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              <span className="hidden sm:inline">Дараах</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className={`w-px h-6 shrink-0 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />

            <button onClick={toggleLike} className={`flex items-center gap-1 p-2 rounded-lg ${isLiked ? "text-red-500" : isDarkMode ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{likeCount}</span>
            </button>

            <button onClick={() => { setShowComments(!showComments); setShowMenu(false) }} className={`flex items-center gap-1 p-2 rounded-lg ${isDarkMode ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}>
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{comments.length}</span>
            </button>

            <Link href={`/book/${book.id}`}>
              <div className="relative w-7 h-10 rounded overflow-hidden shadow shrink-0">
                <Image src={book.cover || "/placeholder.jpg"} alt={book.title} fill className="object-cover" />
              </div>
            </Link>
          </div>
        </div>
      </footer>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setShowOnboarding(false)
              localStorage.setItem("reader-onboarding-seen", "1")
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#16213e] rounded-2xl shadow-2xl max-w-sm w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0E4AA8]/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">📖</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Номын уншигч</h2>
                <p className="text-sm text-gray-500">Хэрхэн ашиглах талаар</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0E4AA8] flex items-center justify-center shrink-0">
                    <ChevronRight className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Бүлэг шилжих</p>
                    <p className="text-xs text-gray-500 mt-0.5">Доод хэсгийн <strong>Өмнөх / Дараах</strong> товч эсвэл гарны ← → товчийг дарна уу</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F26522] flex items-center justify-center shrink-0">
                    <Menu className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Тохиргоо</p>
                    <p className="text-xs text-gray-500 mt-0.5">Дээд баруун буланд байгаа <strong>☰</strong> товчоор үсгийн хэмжээ, харанхуй горимыг тохируулна</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                    <Bookmark className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Хаана зогссоноо хадгална</p>
                    <p className="text-xs text-gray-500 mt-0.5">Номоос гарахад уншсан хуудас автоматаар хадгалагдана</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">•••</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Явц харах</p>
                    <p className="text-xs text-gray-500 mt-0.5">Дээд хэсгийн <strong>улаан мөр</strong> болон доод цэгнүүдээс уншилтын явцаа хянана</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowOnboarding(false)
                  localStorage.setItem("reader-onboarding-seen", "1")
                }}
                className="w-full py-3 bg-[#0E4AA8] hover:bg-[#0E4AA8]/90 text-white rounded-xl font-medium transition-colors"
              >
                Ойлголоо, унших эхэлье!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowComments(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 flex flex-col ${isDarkMode ? "bg-[#16213e]" : "bg-white"}`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h3 className="font-semibold">Сэтгэгдэл ({comments.length})</h3>
                <button onClick={() => setShowComments(false)} className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className={`h-12 w-12 mx-auto mb-3 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Одоогоор сэтгэгдэл байхгүй</p>
                  </div>
                ) : comments.map((c) => (
                  <div key={c.id} className={`p-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{c.name}</span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{new Date(c.createdAt).toLocaleDateString("mn-MN")}</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{c.content}</p>
                  </div>
                ))}
              </div>
              <div className={`p-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <Input placeholder="Таны нэр (заавал биш)" value={commentName} onChange={(e) => setCommentName(e.target.value)} className={`mb-2 ${isDarkMode ? "bg-gray-800 border-gray-600" : ""}`} />
                <div className="flex gap-2">
                  <Input placeholder="Сэтгэгдэл бичих..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addComment()} className={isDarkMode ? "bg-gray-800 border-gray-600" : ""} />
                  <Button onClick={addComment} disabled={!newComment.trim()} className="bg-[#0E4AA8] hover:bg-[#0E4AA8]/90 text-white shrink-0"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
