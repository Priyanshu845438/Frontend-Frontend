
export interface User {
  _id: string;
  id: string;
  username: string;
  name: string;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: 'admin' | 'ngo' | 'company' | 'donor';
  status: 'active' | 'pending' | 'disabled';
  avatar: string;
  createdAt: string;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  profile?: {
    description?: string;
    address?: string;
    website?: string;
  };
}

export interface Campaign {
  _id: string;
  id: string;
  title: string;
  slug: string;
  organizer: string;
  organizerId: string;
  organizerLogo: string;
  description: string;
  fullDescription: string;
  goal: number;
  raised: number;
  category: 'Health' | 'Education' | 'Environment' | 'Disaster Relief';
  location: string;
  verified: boolean;
  urgent: boolean;
  images: string[];
  status: 'active' | 'completed' | 'disabled';
  endDate: string;
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface TeamMember {
  id: number;
  name:string;
  role: string;
  imageUrl: string;
}

export interface PolicyDocument {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface PolicyContent {
  title: string;
  content: string;
}