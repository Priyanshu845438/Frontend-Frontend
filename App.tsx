
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';

// Layouts and Wrappers
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import AdminLayout from './components/admin/AdminLayout.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import AIChatbot from './components/AIChatbot.tsx';

// Public Pages
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import CampaignDetailsPage from './pages/CampaignDetailsPage.tsx';
import DonatePage from './pages/DonatePage.tsx';
import JoinUsPage from './pages/JoinUsPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import LegalPage from './pages/LegalPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage.tsx';
import UserManagementPage from './pages/admin/UserManagementPage.tsx';
import UserProfilePage from './pages/admin/UserProfilePage.tsx';
import CampaignManagementPage from './pages/admin/CampaignManagementPage.tsx';
import SettingsPage from './pages/admin/SettingsPage.tsx';
import ReportsPage from './pages/admin/ReportsPage.tsx';
import NoticesPage from './pages/admin/NoticesPage.tsx';

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
        <HashRouter>
            <ScrollToTop />
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
                    <Route path="/legal" element={<LegalPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
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
                    <Route path="campaigns" element={<CampaignManagementPage />} />
                    <Route path="notices" element={<NoticesPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
