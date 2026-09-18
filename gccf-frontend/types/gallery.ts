export interface Gallery {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryDto {
  title: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  isVisible?: boolean;
  order?: number;
}

export interface UpdateGalleryDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  isVisible?: boolean;
  order?: number;
}