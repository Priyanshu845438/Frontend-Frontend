
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


// --- Data Transformation Layer ---
// This is crucial because the frontend types and backend schemas may differ.

export const transformBackendCampaign = (backendCampaign: any): Campaign => {
  const organizer = backendCampaign.ngoId || { fullName: 'Unknown', avatar: '', _id: '', approvalStatus: 'pending', isActive: false };
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
    images: backendCampaign.images?.length > 0 ? backendCampaign.images : ['https://picsum.photos/seed/' + (backendCampaign.title || 'default') + '/800/600'],
    status,
    endDate: backendCampaign.endDate,
    isActive: backendCampaign.isActive,
  };
};

export const transformBackendUser = (backendUser: any): User => {
    let status: 'active' | 'pending' | 'disabled';
    const isApproved = backendUser.approvalStatus === 'approved';

    // An approved user should be considered active unless explicitly marked as inactive.
    // This handles cases where backend list views might not include the `isActive` field.
    const isActive = isApproved ? backendUser.isActive !== false : backendUser.isActive === true;

    if (isApproved) {
        status = isActive ? 'active' : 'disabled';
    } else if (backendUser.approvalStatus === 'rejected') {
        status = 'disabled';
    } else { // 'pending' or other statuses
        status = 'pending';
    }

    const name = backendUser.fullName || backendUser.name;

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
            description: backendUser.description || backendUser.profile?.description,
            address: backendUser.address || backendUser.profile?.address,
            website: backendUser.website || backendUser.profile?.website,
        }
    };
};


// === API Functions ===

// Auth
export const loginUser = (credentials: { email: string, password: string }) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const signupUser = (userData: any) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
});

export const logoutUser = () => request('/auth/logout', {
    method: 'POST',
});

export const getProfileByUsername = async (username: string) => {
    // This endpoint is composed from available public endpoints.
    const [ngoData, companyData] = await Promise.all([
        request('/public/ngos').catch(() => ({})),
        request('/public/companies').catch(() => ({}))
    ]);

    const publicNgos = ngoData.ngos || (Array.isArray(ngoData) ? ngoData : []);
    const publicCompanies = companyData.companies || (Array.isArray(companyData) ? companyData : []);

    const allOrgs = [
        ...publicNgos.map(transformBackendUser),
        ...publicCompanies.map(transformBackendUser)
    ];
    
    const user = allOrgs.find(u => u.username === username);

    if (!user) {
        throw new Error('Organization profile not found.');
    }

    let campaigns: Campaign[] = [];
    if (user.role === 'ngo') {
        const publicCampaigns = await getPublicCampaigns();
        campaigns = publicCampaigns.filter(c => c.organizerId === user._id);
    }
    
    return { user, campaigns };
};


// Public
export const getCampaignById = async (campaignId: string): Promise<Campaign | null> => {
    const campaigns = await getPublicCampaigns();
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign || null;
};

export const getPublicCampaigns = async (): Promise<Campaign[]> => {
  const data = await request('/public/campaigns');
  const campaigns = data.campaigns || (Array.isArray(data) ? data : []);
  return campaigns.map(transformBackendCampaign);
};

// Admin - Users
export const getAdminUsers = async (): Promise<User[]> => {
    // Attempt to fetch all user roles and gracefully handle if some endpoints don't exist.
    const results = await Promise.allSettled([
        request('/admin/ngos'),
        request('/admin/companies'),
        request('/admin/donors'),
        request('/admin/admins')
    ]);

    const usersData = results.flatMap((result) => {
        if (result.status === 'fulfilled' && result.value) {
            const data = result.value;
            if (Array.isArray(data)) {
                return data; // Response is the array itself
            }
            if (typeof data === 'object' && data !== null) {
                // Find the first property in the response object that is an array
                const arrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
                if (arrayKey) {
                    return data[arrayKey];
                }
            }
        }
        return []; // Return empty array if no user list is found or if promise was rejected
    });
    
    const allUsers = usersData.map(transformBackendUser);

    // Remove duplicates that might appear if a user is listed under multiple endpoints
    const uniqueUsers = Array.from(new Map(allUsers.map(user => [user.id, user])).values());
    
    return uniqueUsers;
};

export const getAdminUserById = async (userId: string): Promise<User | null> => {
    // This is less efficient, but necessary if there's no direct /users/:id endpoint.
    const users = await getAdminUsers();
    return users.find(u => u.id === userId) || null;
};

export const approveUser = (userId: string) => request(`/admin/users/${userId}/approval`, {
    method: 'PUT',
    body: JSON.stringify({ approvalStatus: 'approved', isActive: true }),
});

export const toggleUserStatus = (user: User) => {
  if (user.approvalStatus !== 'approved') {
    return Promise.reject(new Error("Can only enable or disable an approved user."));
  }
  return request(`/admin/users/${user._id}/approval`, {
    method: 'PUT',
    body: JSON.stringify({
      approvalStatus: 'approved', // Keep the user approved
      isActive: !user.isActive,   // Toggle the active state
    }),
  });
};

export const createAdminUser = (userData: any) => request('/admin/create-user', {
    method: 'POST',
    body: JSON.stringify(userData),
});


// Admin - Campaigns
export const getAdminCampaigns = async (): Promise<Campaign[]> => {
    const data = await request('/admin/campaigns');
    const campaigns = data.campaigns || (Array.isArray(data) ? data : []);
    return campaigns.map(transformBackendCampaign);
};

export const toggleCampaignStatus = (campaign: Campaign) => request(`/admin/campaigns/${campaign._id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive: !campaign.isActive }),
});

// Admin - Reports/Dashboard
export const getAdminDashboardStats = async () => {
    // Test script does not specify a dashboard endpoint, assuming one for summary stats
    // based on the various /reports/* endpoints.
    try {
      const data = await request('/admin/reports/dashboard'); 
      return data;
    } catch(e) {
      console.error("Dashboard API failed, returning mock data.", e);
      // Return mock data so the page doesn't crash if the assumed endpoint doesn't exist
      return {
        totalUsers: 0,
        totalCampaigns: 0,
        totalDonations: 0,
        pendingApprovals: 0,
        userDistribution: { donor: 0, ngo: 0, company: 0 },
        campaignStatus: { active: 0, completed: 0, disabled: 0 },
      }
    }
};
