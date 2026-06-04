export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  pages: number
  likes: number
  rating: number
  content: string[]
  categoryId: string
  category: Category
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  slug: string
  name: string
  icon: string
  count: number
}

export interface Comment {
  id: string
  name: string
  content: string
  createdAt: string
}
