export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  eventDate: string;
  location: string;
  slug: string;
  status: 'completed' | 'upcoming';
  mainImage: string;
  galleryImages?: string[];
  organizer?: string;
  attendees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  shortDescription: string;
  eventDate: string;
  location: string;
  slug: string;
  status: 'completed' | 'upcoming';
  mainImage: string;
  galleryImages?: string[];
  organizer?: string;
  attendees?: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  shortDescription?: string;
  eventDate?: string;
  location?: string;
  slug?: string;
  status?: 'completed' | 'upcoming';
  mainImage?: string;
  galleryImages?: string[];
  organizer?: string;
  attendees?: number;
}