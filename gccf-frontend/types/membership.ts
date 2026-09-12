export interface Membership {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  organization?: string;
  message?: string;
  membershipType?: string;
  paymentAttachment?: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  organization?: string;
  message?: string;
  membershipType?: string;
  paymentAttachment?: string;
}

export interface UpdateMembershipDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  organization?: string;
  message?: string;
  membershipType?: string;
  paymentAttachment?: string;
  status?: 'pending' | 'approved' | 'declined';
}

export interface MembershipSettings {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  formDescription: string;
  membershipTypes: string[];
  paymentInstructions: string;
  qrCodeUrl?: string;
}