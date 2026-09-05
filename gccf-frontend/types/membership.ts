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
  status?: 'pending' | 'approved' | 'declined';
}