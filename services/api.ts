
import type { User, Campaign } from '../types.ts';

const API_BASE = 'http://localhost:5000/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Generic request helper
async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
  }

  return responseData;
}


// Data Transformation Layer
export const transformBackendCampaign = (backendCampaign: any): Campaign => {
  const organizer = backendCampaign.ngoId || { 
    fullName: 'Unknown', 
    avatar: '', 
    _id: '', 
    approvalStatus: 'pending', 
    isActive: false 
  };
  const goal = backendCampaign.targetAmount || 0;
  const raised = backendCampaign.currentAmount || 0;

  let status: Campaign['status'] = 'disabled';
  if (backendCampaign.isActive) {
    if (raised >= goal || new Date(backendCampaign.endDate) < new Date()) {
      status = 'completed';
    } else {
      status = 'active';
    }
  }

  return {
    id: backendCampaign._id,
    _id: backendCampaign._id,
    title: backendCampaign.title,
    slug: (backendCampaign.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    organizer: organizer.fullName,
    organizerId: organizer._id,
    organizerLogo: organizer.avatar || `https://picsum.photos/seed/${organizer.fullName}/100`,
    description: (backendCampaign.description || '').substring(0, 100) + '...',
    fullDescription: backendCampaign.description || 'Full description not provided.',
    goal,
    raised,
    category: backendCampaign.category || 'Health',
    location: backendCampaign.location || 'India',
    verified: organizer.approvalStatus === 'approved' && organizer.isActive,
    urgent: backendCampaign.isUrgent || false,
    images: backendCampaign.images?.length > 0 ? backendCampaign.images : [`https://picsum.photos/seed/${backendCampaign.title || 'default'}/800/600`],
    status,
    endDate: backendCampaign.endDate,
    isActive: backendCampaign.isActive,
  };
};

export const transformBackendUser = (backendUser: any): User => {
  let status: 'active' | 'pending' | 'disabled';
  const isApproved = backendUser.approvalStatus === 'approved';
  const isActive = isApproved ? backendUser.isActive !== false : backendUser.isActive === true;

  if (isApproved) {
    status = isActive ? 'active' : 'disabled';
  } else if (backendUser.approvalStatus === 'pending') {
    status = 'disabled';
  } else {
    status = 'pending';
  }

  const name = backendUser.fullName || backendUser.name;
  const profileData = backendUser.profile || {};

  return {
    id: backendUser._id,
    _id: backendUser._id,
    username: (name || '').toLowerCase().replace(/\s+/g, '_'),
    name: name,
    fullName: name,
    email: backendUser.email,
    phoneNumber: backendUser.phoneNumber,
    role: backendUser.role,
    status: status,
    avatar: backendUser.profileImage || `https://picsum.photos/seed/${name}/100`,
    createdAt: backendUser.createdAt,
    isActive: isActive,
    approvalStatus: backendUser.approvalStatus,
    profile: {
      description: backendUser.description || profileData.description,
      address: backendUser.address || profileData.address || profileData.companyAddress,
      website: backendUser.website || profileData.website,
      ...profileData
    }
  };
};

// === API ENDPOINTS ===

// Authentication Endpoints
export const authAPI = {
  login: (credentials: { email: string, password: string }) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (userData: any) => 
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => 
    request('/auth/logout', {
      method: 'POST',
    }),

  refreshToken: () => 
    request('/auth/refresh', {
      method: 'POST',
    }),

  verifyEmail: (token: string) => 
    request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  forgotPassword: (email: string) => 
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) => 
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// User Profile Endpoints
export const userAPI = {
  getProfile: () => 
    request('/user/profile'),

  updateProfile: (userData: any) => 
    request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  uploadAvatar: (formData: FormData) => 
    request('/user/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set multipart headers
    }),

  changePassword: (currentPassword: string, newPassword: string) => 
    request('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  deleteAccount: () => 
    request('/user/account', {
      method: 'DELETE',
    }),
};

// Campaign Endpoints
export const campaignAPI = {
  // Public campaigns
  getPublic: async (): Promise<Campaign[]> => {
    const data = await request('/campaigns/public');
    const campaigns = data.campaigns || (Array.isArray(data) ? data : []);
    return campaigns.map(transformBackendCampaign);
  },

  getById: async (campaignId: string): Promise<Campaign | null> => {
    try {
      const data = await request(`/campaigns/${campaignId}`);
      return transformBackendCampaign(data);
    } catch (error) {
      return null;
    }
  },

  getBySlug: async (slug: string): Promise<Campaign | null> => {
    try {
      const data = await request(`/campaigns/slug/${slug}`);
      return transformBackendCampaign(data);
    } catch (error) {
      return null;
    }
  },

  // User campaigns
  getUserCampaigns: async (): Promise<Campaign[]> => {
    const data = await request('/campaigns/my-campaigns');
    const campaigns = data.campaigns || (Array.isArray(data) ? data : []);
    return campaigns.map(transformBackendCampaign);
  },

  create: (campaignData: any) => 
    request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),

  update: (campaignId: string, campaignData: any) => 
    request(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    }),

  delete: (campaignId: string) => 
    request(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    }),

  uploadImages: (campaignId: string, formData: FormData) => 
    request(`/campaigns/${campaignId}/images`, {
      method: 'POST',
      body: formData,
      headers: {},
    }),
};

// Donation Endpoints
export const donationAPI = {
  create: (donationData: any) => 
    request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    }),

  getUserDonations: () => 
    request('/donations/my-donations'),

  getCampaignDonations: (campaignId: string) => 
    request(`/donations/campaign/${campaignId}`),

  processPayment: (paymentData: any) => 
    request('/donations/process-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
};

// Organization Endpoints
export const organizationAPI = {
  getPublic: async () => {
    const [ngoData, companyData] = await Promise.allSettled([
      request('/organizations/ngos/public'),
      request('/organizations/companies/public')
    ]);

    const ngos = ngoData.status === 'fulfilled' ? 
      (ngoData.value.ngos || ngoData.value || []) : [];
    const companies = companyData.status === 'fulfilled' ? 
      (companyData.value.companies || companyData.value || []) : [];

    return {
      ngos: ngos.map(transformBackendUser),
      companies: companies.map(transformBackendUser)
    };
  },

  getByUsername: async (username: string) => {
    const { ngos, companies } = await organizationAPI.getPublic();
    const allOrgs = [...ngos, ...companies];

    const user = allOrgs.find(u => u.username === username);
    if (!user) {
      throw new Error('Organization profile not found.');
    }

    let campaigns: Campaign[] = [];
    if (user.role === 'ngo') {
      const publicCampaigns = await campaignAPI.getPublic();
      campaigns = publicCampaigns.filter(c => c.organizerId === user._id);
    }

    return { user, campaigns };
  },
};

// Admin Endpoints
export const adminAPI = {
  // Users Management
  getUsers: async (filters?: { page?: number; limit?: number; role?: string; status?: string }): Promise<{ users: User[]; pagination?: any }> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.role) queryParams.append('role', filters.role);
      if (filters?.status) queryParams.append('status', filters.status);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';

      const response = await request(endpoint);
      const data = response.data || response;
      const users = data.users || (Array.isArray(data) ? data : []);

      return {
        users: users.map(transformBackendUser),
        pagination: data.pagination
      };
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return { users: [] };
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const { users } = await adminAPI.getUsers({ limit: 1000 });
      return users;
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      return [];
    }
  },

  getUserById: async (userId: string): Promise<{ user: User, stats: any, activities: any[], campaigns: Campaign[] } | null> => {
    try {
        const response = await request(`/admin/users/${userId}`);
        const userProfile = response?.userProfile;

        if (!userProfile?.user?._id) {
            console.error("User profile structure not found in response for ID:", userId, response);
            return null;
        }
        
        const combinedUserData = {
            ...userProfile.user,
            profile: userProfile.profile,
        };

        return {
            user: transformBackendUser(combinedUserData),
            stats: userProfile.stats || {},
            activities: (userProfile.activities || []).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
            campaigns: (userProfile.campaigns || []).map(transformBackendCampaign)
        };

    } catch (error) {
        console.error(`Error fetching user by ID ${userId}:`, error);
        return null;
    }
  },

  createUser: (userData: any) => 
    request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  updateUser: (userId: string, userData: any) => 
    request(`/admin/users/${userId}/details`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  updateUserProfile: (userId: string, profileData: any) =>
    request(`/admin/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  approveUser: (userId: string) => 
    request(`/admin/users/${userId}/approval`, {
      method: 'PUT',
      body: JSON.stringify({ approvalStatus: 'approved' }),
    }),

  rejectUser: (userId: string) => 
    request(`/admin/users/${userId}/approval`, {
      method: 'PUT',
      body: JSON.stringify({ approvalStatus: 'pending' }),
    }),

  toggleUserStatus: (user: User) => {
    // Toggle between approved and rejected status for active/inactive
    const newApprovalStatus = user.isActive ? 'pending' : 'approved';
    return request(`/admin/users/${user._id}/approval`, {
      method: 'PUT',
      body: JSON.stringify({ 
        approvalStatus: newApprovalStatus
      }),
    });
  },

  deleteUser: (userId: string) => 
    request(`/admin/users/${userId}/complete`, {
      method: 'DELETE',
    }),

  // Campaigns Management
  getCampaigns: async (): Promise<Campaign[]> => {
    const data = await request('/admin/campaigns');
    const campaigns = data.campaigns || (Array.isArray(data) ? data : []);
    return campaigns.map(transformBackendCampaign);
  },

  toggleCampaignStatus: (campaign: Campaign) => 
    request(`/admin/campaigns/${campaign._id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !campaign.isActive }),
    }),

  deleteCampaign: (campaignId: string) => 
    request(`/admin/campaigns/${campaignId}`, {
      method: 'DELETE',
    }),

  // Dashboard & Reports
  getDashboardStats: async () => {
    try {
      const response = await request('/admin/dashboard/stats');
      const data = response.data || response;
      const overview = data.overview || {};

      return {
        totalUsers: overview.totalUsers || 0,
        totalCampaigns: overview.totalCampaigns || 0,
        totalDonations: overview.totalRaised || 0,
        pendingApprovals: overview.pendingApprovals || 0,
        userDistribution: { 
          donor: (overview.totalUsers || 0) - (overview.totalngos || 0) - (overview.totalCompanies || 0), 
          ngo: overview.totalngos || 0, 
          company: overview.totalCompanies || 0 
        },
        campaignStatus: { 
          active: overview.activeCampaigns || 0, 
          completed: 0, 
          disabled: (overview.totalCampaigns || 0) - (overview.activeCampaigns || 0) 
        },
        recentUsers: data.recentUsers || [],
        systemHealth: data.systemHealth || {}
      };
    } catch (error) {
      console.error("Dashboard API failed:", error);
      return {
        totalUsers: 0,
        totalCampaigns: 0,
        totalDonations: 0,
        pendingApprovals: 0,
        userDistribution: { donor: 0, ngo: 0, company: 0 },
        campaignStatus: { active: 0, completed: 0, disabled: 0 },
        recentUsers: [],
        systemHealth: {}
      };
    }
  },

  getReports: (reportType: string, params?: any) => 
    request(`/admin/reports/${reportType}`, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    }),
};

// Backwards compatibility - Legacy function exports
export const loginUser = authAPI.login;
export const signupUser = authAPI.signup;
export const logoutUser = authAPI.logout;
export const getProfileByUsername = organizationAPI.getByUsername;
export const getCampaignById = campaignAPI.getById;
export const getPublicCampaigns = campaignAPI.getPublic;
export const getAdminUsers = adminAPI.getAllUsers;
export const getAdminUserById = adminAPI.getUserById;
export const approveUser = adminAPI.approveUser;
export const toggleUserStatus = adminAPI.toggleUserStatus;
export const createAdminUser = adminAPI.createUser;
export const updateUser = adminAPI.updateUser;
export const getAdminCampaigns = adminAPI.getCampaigns;
export const toggleCampaignStatus = adminAPI.toggleCampaignStatus;
export const getAdminDashboardStats = adminAPI.getDashboardStats;
export const updateUserProfile = adminAPI.updateUserProfile;
export const deleteUser = adminAPI.deleteUser;
