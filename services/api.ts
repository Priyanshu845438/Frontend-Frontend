
import type { User, Campaign, Notice, Task, CampaignReportSummary, UserReportStats, DonationReportSummary, FinancialReportSummary } from '../types.ts';

const API_BASE = 'http://localhost:5000/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Generic request helper
async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  const responseData = await response.json().catch(() => ({}));

  // Handle public API response structure
  if (endpoint.startsWith('/public/')) {
    if (!response.ok || !responseData.success) {
      if (responseData.errors) {
        const errorDetails = responseData.errors.map((e: any) => `${e.param}: ${e.message}`).join(', ');
        throw new Error(`${responseData.message}: ${errorDetails}`);
      }
      throw new Error(responseData.message || `Request failed with status ${response.status}`);
    }
    // If a 'data' wrapper exists, return its content. Otherwise, return the whole response object.
    // This makes it flexible to handle both { success: true, data: { ... } } and { success: true, ... }
    return responseData.data || responseData;
  }

  // Handle other APIs
  if (!response.ok) {
    throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
  }

  return responseData;
}


// Data Transformation Layer
export const transformBackendCampaign = (backendCampaign: any): Campaign => {
    let organizerName = 'Unknown Organizer';
    let organizerId = '';
    let organizerLogo = `https://picsum.photos/seed/default-ngo/100`;
    let verified = false;

    // Handle the structure from the user's curl response: { "ngoId": { "_id": "...", "ngoName": "..." } }
    if (backendCampaign.ngoId && typeof backendCampaign.ngoId === 'object') {
        organizerName = backendCampaign.ngoId.ngoName || backendCampaign.ngoId.name || 'Unknown';
        organizerId = backendCampaign.ngoId._id;
        organizerLogo = backendCampaign.ngoId.logo || `https://picsum.photos/seed/${organizerName}/100`;
        // The curl response for ngoId doesn't have verification info. Let's assume verified if an NGO is linked.
        verified = true;
    } 
    // Handle the structure from the original API spec I was given
    else if (backendCampaign.ngo && typeof backendCampaign.ngo === 'object') {
        organizerName = backendCampaign.ngo.name;
        organizerId = backendCampaign.ngo._id;
        organizerLogo = backendCampaign.ngo.logo || `https://picsum.photos/seed/${organizerName}/100`;
        verified = backendCampaign.ngo.isVerified || false;
    } 
    // Fallback for admin-created campaigns that might just have a name
    else if (typeof backendCampaign.organizer === 'string') {
        organizerName = backendCampaign.organizer;
    }

    const goal = backendCampaign.targetAmount || backendCampaign.goalAmount || 0;
    const raised = backendCampaign.raisedAmount || backendCampaign.currentAmount || 0;

    let status: Campaign['status'] = 'disabled';
    if (backendCampaign.isActive !== false) {
        if (raised >= goal && goal > 0) {
            status = 'completed';
        } else {
            status = 'active';
        }
    }
    if (backendCampaign.status) {
      status = backendCampaign.status.toLowerCase();
    }

    // The curl response shows 'campaignImages'. The original type might have 'images'. Handle both.
    const images = backendCampaign.images?.length > 0 ? backendCampaign.images :
                   backendCampaign.campaignImages?.length > 0 ? backendCampaign.campaignImages :
                   [`https://picsum.photos/seed/${backendCampaign.title || 'default'}/800/600`];


  return {
    ...backendCampaign,
    id: backendCampaign._id,
    _id: backendCampaign._id,
    title: backendCampaign.title,
    slug: (backendCampaign.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    organizer: organizerName,
    organizerId: organizerId,
    organizerLogo: organizerLogo,
    description: (backendCampaign.description || '').substring(0, 100) + '...',
    fullDescription: backendCampaign.fullDescription || backendCampaign.description || backendCampaign.explainStory || 'Full description not provided.',
    goal,
    raised,
    category: backendCampaign.category || 'Health',
    location: backendCampaign.location || 'India',
    verified,
    urgent: backendCampaign.isUrgent || false,
    images: images,
    status,
    endDate: backendCampaign.endDate,
    isActive: backendCampaign.isActive !== false,
    approvalStatus: backendCampaign.approvalStatus || 'pending',
  };
};

export const transformBackendUser = (backendUser: any): User => {
  let status: 'active' | 'pending' | 'disabled';
  const isApproved = backendUser.approvalStatus === 'approved';
  
  if (isApproved && backendUser.isActive) {
      status = 'active';
  } else if (!isApproved && backendUser.approvalStatus === 'pending') {
      status = 'pending';
  } else {
      status = 'disabled';
  }

  const name = backendUser.fullName || backendUser.name || backendUser.ngoName || backendUser.companyName;
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
    avatar: backendUser.profileImage || backendUser.logo || `https://picsum.photos/seed/${name}/100`,
    createdAt: backendUser.createdAt,
    isActive: backendUser.isActive,
    approvalStatus: backendUser.approvalStatus,
    profile: {
      _id: profileData._id,
      description: backendUser.description || profileData.description,
      address: backendUser.address || profileData.address || profileData.companyAddress,
      website: backendUser.website || profileData.website,
      ...profileData,
      ...backendUser // For public profiles that have fields at the top level
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
};

// User Profile Endpoints
export const userAPI = {
  // These are for the logged-in user, and remain unchanged
  getProfile: () => request('/user/profile'),
  updateProfile: (userData: any) => request('/user/profile', { method: 'PUT', body: JSON.stringify(userData) }),
};

// Campaign Endpoints
export const campaignAPI = {
  getPublic: async (filters?: { page?: number; limit?: number; category?: string; location?: string; status?: string; sortBy?: string; search?: string }): Promise<{ campaigns: Campaign[], pagination: any, filters: any }> => {
    const queryParams = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value.toString());
            }
        });
    }
    
    const data = await request(`/public/campaigns?${queryParams.toString()}`);
    return {
        campaigns: data.campaigns.map(transformBackendCampaign),
        pagination: data.pagination,
        filters: data.filters
    };
  },

  getById: async (campaignId: string): Promise<Campaign | null> => {
    try {
      const data = await request(`/public/campaigns/${campaignId}`);
      return transformBackendCampaign(data.campaign);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  
  getFeatured: async (): Promise<Campaign[]> => {
    const data = await request('/public/campaigns/featured');
    // Assuming the endpoint returns a simple array under a key
    const campaigns = data.campaigns || data;
    return campaigns.map(transformBackendCampaign);
  },
};

// Donation Endpoints
export const donationAPI = {
  // Placeholder, assuming donation flow starts on client
};

// Organization Endpoints
export const organizationAPI = {
  getNgoProfile: async (id: string): Promise<{ user: User, campaigns: Campaign[] }> => {
    const data = await request(`/public/ngo/${id}`);
    return {
        user: transformBackendUser(data.ngo),
        campaigns: (data.ngo.campaigns || []).map(transformBackendCampaign)
    }
  },
  getCompanyProfile: async (id: string): Promise<User> => {
    const data = await request(`/public/company/${id}`);
    return transformBackendUser(data.company);
  },
  // This function is now deprecated in favor of specific profile endpoints
  getProfileByUsername: async (username: string) => {
    console.warn("getProfileByUsername is deprecated. Use getNgoProfile or getCompanyProfile with an ID.");
    // This is a legacy fallback, it might not work with the new API.
    throw new Error("Function not supported by new API. Please link to profiles by ID.");
  },
};

// Public Stats & Forms API
export const publicAPI = {
    getPlatformStats: async () => {
        return await request('/public/stats');
    },
    submitContactForm: (formData: { name: string; email: string; subject: string; message: string; type: string }) => {
        return request('/public/contact', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    },
    subscribeNewsletter: (formData: { email: string; interests?: string[] }) => {
        return request('/public/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    }
};

// User Task Management API
export const taskAPI = {
  getTasks: (filters: { page?: number; limit?: number; status?: string; priority?: string; category?: string; search?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
            queryParams.append(key, value.toString());
        }
    });
    return request(`/user/tasks?${queryParams.toString()}`);
  },

  createTask: (taskData: Partial<Task>) => request('/user/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  }),

  getTaskById: (id: string) => request(`/user/tasks/${id}`),

  updateTask: (id: string, taskData: Partial<Task>) => request(`/user/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  }),

  deleteTask: (id: string) => request(`/user/tasks/${id}`, {
    method: 'DELETE'
  }),

  markTaskComplete: (id: string) => request(`/user/tasks/${id}/complete`, {
    method: 'PATCH'
  }),

  getCalendarView: (params: { year: number; month: number }) => request(`/user/tasks/calendar/view?year=${params.year}&month=${params.month}`),

  getTodaysTasks: () => request('/user/tasks/today/list'),

  getUpcomingTasks: () => request('/user/tasks/upcoming/list')
};

// Admin Endpoints
export const adminAPI = {
  // Users Management
  getUsers: async (filters?: { page?: number; limit?: number; role?: string; approvalStatus?: string; search?: string }): Promise<{ users: User[]; pagination?: any }> => {
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.role && filters.role !== 'all') queryParams.append('role', filters.role);
    if (filters?.approvalStatus && filters.approvalStatus !== 'all') queryParams.append('approvalStatus', filters.approvalStatus);
    if (filters?.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';

    const response = await request(endpoint);
    const data = response.data || response;
    const users = data.users || (Array.isArray(data) ? data : []);

    return {
      users: users.map(transformBackendUser),
      pagination: data.pagination
    };
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

  approveUser: (userId: string, status: 'approved' | 'rejected') => 
    request(`/admin/users/${userId}/approval`, {
      method: 'PUT',
      body: JSON.stringify({ approvalStatus: status }),
    }),

  toggleUserStatus: (user: User) => {
    return request(`/admin/users/${user._id}/details`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !user.isActive }),
    });
  },

  deleteUser: (userId: string) => 
    request(`/admin/users/${userId}/complete`, {
      method: 'DELETE',
    }),
    
  generateNgoShareLink: (profileId: string) => 
    request(`/admin/ngos/${profileId}/share`, { method: 'POST' }),

  generateCompanyShareLink: (profileId: string) => 
    request(`/admin/companies/${profileId}/share`, { method: 'POST' }),

  getShareablePageDesign: async (shareId: string) => {
    const response = await request(`/admin/share/${shareId}/customize`);
    return response.customDesign || {};
  },

  updateShareablePageDesign: (shareId: string, design: { html: string; css: string; additionalData?: any }) =>
    request(`/admin/share/${shareId}/customize`, {
      method: 'PUT',
      body: JSON.stringify({ customDesign: design }),
    }),
  
  getNgos: async (): Promise<User[]> => {
    const { users } = await adminAPI.getUsers({ role: 'ngo', approvalStatus: 'approved', limit: 1000 });
    return users;
  },

  // Campaigns Management
  getCampaigns: async (filters: { page?: number; limit?: number; status?: string; approvalStatus?: string; search?: string }): Promise<{ campaigns: Campaign[]; pagination?: any }> => {
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
    if (filters.approvalStatus && filters.approvalStatus !== 'all') queryParams.append('approvalStatus', filters.approvalStatus);
    if (filters.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/admin/campaigns?${queryString}`;
    
    const response = await request(endpoint);
    const campaigns = response.data?.campaigns || response.campaigns || (Array.isArray(response) ? response : []);
    
    return {
      campaigns: campaigns.map(transformBackendCampaign),
      pagination: response.data?.pagination || response.pagination
    };
  },
  
  getCampaignById: async (campaignId: string): Promise<Campaign | null> => {
    const data = await request(`/admin/campaigns/${campaignId}`);
    return data ? transformBackendCampaign(data.campaign || data) : null;
  },
  
  createCampaign: (campaignData: any) =>
    request('/admin/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),

  updateCampaign: (campaignId: string, campaignData: any) =>
    request(`/admin/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    }),
    
  updateCampaignStatus: (campaignId: string, isActive: boolean) =>
    request(`/admin/campaigns/${campaignId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    }),

  deleteCampaign: (campaignId: string) => 
    request(`/admin/campaigns/${campaignId}`, {
      method: 'DELETE',
    }),
    
  approveCampaign: (campaignId: string, status: 'approved' | 'rejected') => 
    adminAPI.updateCampaign(campaignId, { approvalStatus: status }),
  
  generateCampaignShareLink: (campaignId: string) => 
    request(`/admin/campaigns/${campaignId}/share`, { method: 'POST' }),


  // Notice Management
  noticeAPI: {
    getNotices: (filters: { page?: number; limit?: number; type?: string; priority?: string; search?: string; status?: string, targetRole?: string }): Promise<{notices: Notice[], pagination: any}> => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                queryParams.append(key, value.toString());
            }
        });
        const queryString = queryParams.toString();
        return request(`/admin/notices?${queryString}`);
    },
    createNotice: (data: Partial<Notice>) => request('/admin/notices', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getNoticeById: (id: string): Promise<Notice> => request(`/admin/notices/${id}`),
    updateNotice: (id: string, data: Partial<Notice>) => request(`/admin/notices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteNotice: (id: string) => request(`/admin/notices/${id}`, {
        method: 'DELETE',
    }),
  },


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
        pendingApprovals: (overview.pendingUsers || 0) + (overview.pendingCampaigns || 0),
        userDistribution: { 
          donor: (overview.totalUsers || 0) - (overview.totalNgos || 0) - (overview.totalCompanies || 0), 
          ngo: overview.totalNgos || 0, 
          company: overview.totalCompanies || 0 
        },
        campaignStatus: { 
          active: overview.activeCampaigns || 0, 
          completed: overview.completedCampaigns || 0,
          disabled: (overview.totalCampaigns || 0) - (overview.activeCampaigns || 0) - (overview.completedCampaigns || 0)
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

  reportsAPI: {
    getUsersReport: (filters: any): Promise<{ users: User[], stats: UserReportStats }> => {
        const queryParams = new URLSearchParams(filters);
        return request(`/admin/reports/users?${queryParams.toString()}`);
    },
    getCampaignsReport: (filters: any): Promise<{ campaigns: any[], summary: CampaignReportSummary }> => {
        const queryParams = new URLSearchParams(filters);
        return request(`/admin/reports/campaigns?${queryParams.toString()}`);
    },
    getDonationsReport: (filters: any): Promise<{ donations: any[], summary: DonationReportSummary }> => {
        const queryParams = new URLSearchParams(filters);
        return request(`/admin/reports/donations?${queryParams.toString()}`);
    },
    getFinancialReport: (filters: any): Promise<FinancialReportSummary> => {
        const queryParams = new URLSearchParams(filters);
        return request(`/admin/reports/financial?${queryParams.toString()}`);
    },
    exportReport: async (reportType: string, filters: any, format: 'pdf' | 'excel') => {
        const queryParams = new URLSearchParams({ ...filters, export: format });
        const url = `${API_BASE}/admin/reports/${reportType}?${queryParams.toString()}`;
        const token = getToken();

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to export report.`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    },
  },
};

// --- Public APIs (Legacy Naming) ---
export const getSharedProfile = async (shareId: string): Promise<{ user: User, campaigns: Campaign[], customization?: { html: string; css: string } } | null> => {
    try {
        const data = await request(`/public/share/profile/${shareId}`);
        const userDetails = data.profile?.userId;

        if (!data || !data.profile || !userDetails?._id) {
            console.error("Shared profile data structure not found", data);
            return null;
        }
        
        const combinedUserData = { ...userDetails, role: data.type, profile: data.profile };

        return {
            user: transformBackendUser(combinedUserData),
            campaigns: (data.campaigns || []).map(transformBackendCampaign),
            customization: data.customDesign
        };
    } catch (error) {
        console.error(`Error fetching shared profile with ID ${shareId}:`, error);
        return null;
    }
};

export const getSharedCampaign = async (shareId: string): Promise<{ campaign: Campaign } | null> => {
    try {
        const data = await request(`/public/share/campaign/${shareId}`);
        if (!data || !data.campaign || !data.campaign._id) {
            return null;
        }
        return { campaign: transformBackendCampaign(data.campaign) };
    } catch (error) {
        console.error(`Error fetching shared campaign with ID ${shareId}:`, error);
        return null;
    }
};


// Backwards compatibility - Legacy function exports
export const loginUser = authAPI.login;
export const signupUser = authAPI.signup;
export const logoutUser = authAPI.logout;
export const getProfileByUsername = organizationAPI.getProfileByUsername;
export const getCampaignById = campaignAPI.getById;
export const getPublicCampaigns = async (): Promise<Campaign[]> => {
    const data = await campaignAPI.getPublic({ limit: 100 }); // Get a decent number for dropdowns
    return data.campaigns;
};
export const getAdminUsers = adminAPI.getAllUsers;
export const getAdminUserById = adminAPI.getUserById;
export const approveUser = (userId: string) => adminAPI.approveUser(userId, 'approved');
export const rejectUser = (userId: string) => adminAPI.approveUser(userId, 'rejected');
export const toggleUserStatus = adminAPI.toggleUserStatus;
export const createAdminUser = adminAPI.createUser;
export const updateUser = adminAPI.updateUser;
export const getAdminCampaigns = async () => (await adminAPI.getCampaigns({limit: 1000})).campaigns;
export const toggleCampaignStatus = (campaign: Campaign) => adminAPI.updateCampaignStatus(campaign._id, !campaign.isActive);
export const getAdminDashboardStats = adminAPI.getDashboardStats;
export const updateUserProfile = adminAPI.updateUserProfile;
export const deleteUser = adminAPI.deleteUser;
export const getShareablePageDesign = adminAPI.getShareablePageDesign;
export const updateShareablePageDesign = adminAPI.updateShareablePageDesign;
