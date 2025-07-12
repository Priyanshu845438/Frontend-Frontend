
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';

// Layouts and Wrappers
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import AdminLayout from './components/admin/AdminLayout.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute.tsx';
import AIChatbot from './components/AIChatbot.tsx';
import ToastContainer from './components/ToastContainer.tsx';

// Public Pages
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import CampaignDetailsPage from './pages/CampaignDetailsPage.tsx';
import DonatePage from './pages/DonatePage.tsx';
import JoinUsPage from './pages/JoinUsPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import PublicProfilePage from './pages/PublicProfilePage.tsx';
import ShareProfilePage from './pages/ShareProfilePage.tsx';
import ShareCampaignPage from './pages/ShareCampaignPage.tsx';
import TaskManagerPage from './pages/TaskManagerPage.tsx';

// New Pages
import ImpactPage from './pages/ImpactPage.tsx';
import PartnersPage from './pages/PartnersPage.tsx';
import FAQPage from './pages/FAQPage.tsx';
import TransparencyPage from './pages/TransparencyPage.tsx';
import GetInvolvedPage from './pages/GetInvolvedPage.tsx';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage.tsx';
import UserManagementPage from './pages/admin/UserManagementPage.tsx';
import UserProfilePage from './pages/admin/UserProfilePage.tsx';
import CampaignManagementPage from './pages/admin/CampaignManagementPage.tsx';
import CreateCampaignPage from './pages/admin/CreateCampaignPage.tsx';
import EditCampaignPage from './pages/admin/EditCampaignPage.tsx';
import AdminCampaignDetailsPage from './pages/admin/AdminCampaignDetailsPage.tsx';
import SettingsPage from './pages/admin/SettingsPage.tsx';
import ReportsPage from './pages/admin/ReportsPage.tsx';
import CustomizeSharePage from './pages/admin/CustomizeSharePage.tsx';
import NoticeManagementPage from './pages/admin/NoticeManagementPage.tsx';
import CreateNoticePage from './pages/admin/CreateNoticePage.tsx';
import EditNoticePage from './pages/admin/EditNoticePage.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <AIChatbot />
  </div>
);

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <ToastContainer />
            <Routes>
                {/* Public-facing routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/campaign/:campaignId" element={<CampaignDetailsPage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route path="/join-us" element={<JoinUsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/ngo/:ngoId" element={<PublicProfilePage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    
                    {/* New Pages */}
                    <Route path="/impact" element={<ImpactPage />} />
                    <Route path="/partners" element={<PartnersPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/transparency" element={<TransparencyPage />} />
                    <Route path="/get-involved" element={<GetInvolvedPage />} />
                    
                    <Route 
                        path="/tasks"
                        element={
                            <AuthenticatedRoute>
                                <TaskManagerPage />
                            </AuthenticatedRoute>
                        }
                    />
                </Route>

                {/* Admin routes */}
                <Route 
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="users/:userId" element={<UserProfilePage />} />
                    <Route path="users/:userId/customize" element={<CustomizeSharePage />} />
                    <Route path="campaigns" element={<CampaignManagementPage />} />
                    <Route path="campaigns/new" element={<CreateCampaignPage />} />
                    <Route path="campaigns/:campaignId" element={<AdminCampaignDetailsPage />} />
                    <Route path="campaigns/:campaignId/edit" element={<EditCampaignPage />} />
                    <Route path="notices" element={<NoticeManagementPage />} />
                    <Route path="notices/new" element={<CreateNoticePage />} />
                    <Route path="notices/:noticeId/edit" element={<EditNoticePage />} />
                    <Route path="tasks" element={<TaskManagerPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Standalone Shared Pages */}
                <Route path="/share/profile/:shareId" element={<ShareProfilePage />} />
                <Route path="/share/campaign/:shareId" element={<ShareCampaignPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
