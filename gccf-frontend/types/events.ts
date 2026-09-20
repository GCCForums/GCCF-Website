export interface EventSponsorItem {
  id?: string;
  name?: string;
  logo: string;
  websiteUrl?: string;
}

export interface EventSponsorTier {
  id?: string;
  tier: string;
  sponsors: EventSponsorItem[];
}

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
  registrationUrl?: string;
  organizer?: string;
  attendees?: number;
  sponsors?: EventSponsorTier[];
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
  registrationUrl?: string;
  organizer?: string;
  attendees?: number;
  sponsors?: EventSponsorTier[];
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
  registrationUrl?: string;
  organizer?: string;
  attendees?: number;
  sponsors?: EventSponsorTier[];
}