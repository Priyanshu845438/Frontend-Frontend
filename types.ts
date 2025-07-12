
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
    _id?: string;
    description?: string;
    address?: string;
    website?: string;
    // NGO specific
    ngoName?: string;
    registrationNumber?: string;
    registeredYear?: string;
    numberOfEmployees?: number;
    ngoType?: string;
    panNumber?: string;
    tanNumber?: string;
    gstNumber?: string;
    is80GCertified?: boolean;
    is12ACertified?: boolean;
    authorizedPerson?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    bankDetails?: {
        accountHolderName?: string;
        accountNumber?: string;
        ifscCode?: string;
        bankName?: string;
        branchName?: string;
    };
    // Company specific
    companyName?: string;
    companyEmail?: string;
    companyPhoneNumber?: string;
    companyAddress?: string;
    companyType?: string;
    ceoName?: string;
    ceoContactNumber?: string;
    ceoEmail?: string;
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
  category: string;
  location: string;
  verified: boolean;
  urgent: boolean;
  images: string[];
  status: 'active' | 'completed' | 'disabled';
  endDate: string;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  targetAmount?: number;
  ngoId?: { _id: string; fullName: string; };
  // Add all other fields from API
  campaignName?: string;
  goalAmount?: number;
  currentAmount?: number;
  beneficiaries?: string;
  importance?: string;
  explainStory?: string;
  contactNumber?: string;
  donationLink?: string;
  createdBy?: string | User;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetRole: 'all' | 'ngo' | 'company' | 'donor' | 'admin';
  targetUsers?: string[];
  isActive: boolean;
  sendEmail?: boolean;
  scheduledAt?: string;
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  readBy: string[];
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
  category: 'Legal' | 'Financial';
}

export interface PolicyContent {
  title: string;
  content: string;
}

export interface UserReportStats {
  totalUsers: number;
  roleDistribution: { [key: string]: number };
  statusDistribution: { [key: string]: number };
  approvalDistribution: { [key: string]: number };
  monthlyRegistrations: { [key: string]: number };
}

export interface CampaignReportSummary {
    totalCampaigns: number;
    activeCampaigns: number;
    approvedCampaigns: number;
    totalTargetAmount: number;
    totalRaisedAmount: number;
    categoryDistribution: { [key: string]: number };
}

export interface DonationReportSummary {
    totalDonations: number;
    totalAmount: number;
    averageAmount: number;
    uniqueDonors: number;
    uniqueCampaigns: number;
    paymentMethodDistribution: { [key: string]: number };
    statusDistribution: { [key:string]: number };
    monthlyTrends: { [key: string]: { count: number; amount: number } };
}

export interface FinancialReportSummary {
    summary: {
      totalAmount: number;
      totalDonations: number;
      averageAmount: number;
    };
    ngoWiseCollection: {
        _id: string;
        ngoName: string;
        totalAmount: number;
        totalDonations: number;
        campaignCount: number;
    }[];
    monthlyTrends: {
        _id: { year: number; month: number };
        totalAmount: number;
        totalDonations: number;
    }[];
    categoryWiseDistribution: {
        _id: string;
        totalAmount: number;
        totalDonations: number;
    }[];
    reportPeriod: {
        startDate: string;
        endDate: string;
    };
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  category: 'meeting' | 'review' | 'approval' | 'maintenance' | 'deadline' | 'other';
  reminderBefore?: number;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: string;
  notes?: string;
  createdBy: string;
  reminderSent?: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface TaskStats {
    total: number;
    pending: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
    overdue: number;
}

export interface FaqItem {
    question: string;
    answer: string;
    category: 'General' | 'Donors' | 'NGOs & Partners' | 'Technical';
}

export interface Partner {
    id: number;
    name: string;
    logoUrl: string;
    type: 'Corporate' | 'Foundation' | 'Institutional';
}

export interface ImpactStory {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    campaignCategory: string;
}
