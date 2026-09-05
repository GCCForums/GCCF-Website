export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  author?: string;
  category?: string;
  slug: string;
  featuredImage: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDto {
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  author?: string;
  category?: string;
  slug: string;
  featuredImage: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
}

export interface UpdateNewsDto {
  title?: string;
  content?: string;
  excerpt?: string;
  publishedDate?: string;
  author?: string;
  category?: string;
  slug?: string;
  featuredImage?: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
}