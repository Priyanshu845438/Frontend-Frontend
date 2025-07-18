



import React, { useState, useEffect, useCallback, ChangeEvent, MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiShield, FiHardDrive, FiSave, FiLoader, FiAlertCircle, FiImage, FiInfo, FiHash, FiPhone, FiMapPin, FiGlobe, FiType, FiClock, FiKey, FiUsers, FiCpu, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import Button from '../../components/Button.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { adminAPI, API_SERVER_URL } from '../../services/api.ts';
import type { User } from '../../types.ts';


type SettingsTab = 'general' | 'security' | 'system';

const SettingsCard = ({ title, description, icon, children, footer }: { title: string, description: string, icon: React.ReactNode, children: React.ReactNode, footer?: React.ReactNode }) => (
    <div className="bg-white dark:bg-brand-dark-200 shadow-md rounded-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <div className="text-brand-gold">{icon}</div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        {footer && <div className="bg-gray-50 dark:bg-brand-dark px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">{footer}</div>}
    </div>
);

const FormRow = ({ label, children, hint, htmlFor }: { label: string, children: React.ReactNode, hint?: string, htmlFor?: string }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-1">{children}</div>
        {hint && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
);

const GeneralSettings = ({ settings, onSave, loading }) => {
    const [formData, setFormData] = useState(settings.branding || {});
    const [contactData, setContactData] = useState(settings.contact || {});
    const [copyrightData, setCopyrightData] = useState(settings.copyright || {});
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(settings.branding?.logo || null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(settings.branding?.favicon || null);

    useEffect(() => {
        setFormData(settings.branding || {});
        setContactData(settings.contact || {});
        setCopyrightData(settings.copyright || {});
        setLogoPreview(settings.branding?.logo ? `${API_SERVER_URL}${settings.branding.logo}` : null);
        setFaviconPreview(settings.branding?.favicon ? `${API_SERVER_URL}${settings.branding.favicon}` : null);
    }, [settings]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile, setPreview) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    
    return (
        <div className="space-y-6">
            <SettingsCard title="Branding" description="Customize your platform's appearance." icon={<FiImage size={24} />} footer={
                <Button onClick={() => onSave({ type: 'branding', data: { branding: formData, contact: contactData, copyright: copyrightData, logo: logoFile, favicon: faviconFile } })} disabled={loading}>
                    {loading ? <><FiLoader className="animate-spin mr-2"/>Saving...</> : <><FiSave className="mr-2"/>Save Branding</>}
                </Button>
            }>
                <FormRow label="Site Name">
                    <input type="text" value={formData.siteName || ''} onChange={e => setFormData({...formData, siteName: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
                <div className="grid grid-cols-2 gap-4">
                    <FormRow label="Primary Color">
                        <input type="color" value={formData.primaryColor || '#000000'} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="w-full h-10 border rounded-md" />
                    </FormRow>
                    <FormRow label="Secondary Color">
                        <input type="color" value={formData.secondaryColor || '#000000'} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} className="w-full h-10 border rounded-md" />
                    </FormRow>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <FormRow label="Logo">
                        {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-16 mb-2 border p-1 rounded-md bg-gray-100 dark:bg-brand-dark" />}
                        <input type="file" onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/20 file:text-brand-gold hover:file:bg-brand-gold/30"/>
                    </FormRow>
                    <FormRow label="Favicon">
                        {faviconPreview && <img src={faviconPreview} alt="Favicon Preview" className="h-16 mb-2 border p-1 rounded-md bg-gray-100 dark:bg-brand-dark" />}
                        <input type="file" onChange={(e) => handleFileChange(e, setFaviconFile, setFaviconPreview)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/20 file:text-brand-gold hover:file:bg-brand-gold/30"/>
                    </FormRow>
                </div>
                 <FormRow label="Contact Email">
                    <input type="email" value={contactData.email || ''} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
                <FormRow label="Contact Phone">
                    <input type="tel" value={contactData.phone || ''} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
                 <FormRow label="Contact Address">
                    <input type="text" value={contactData.address || ''} onChange={e => setContactData({...contactData, address: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
                <FormRow label="Copyright Text">
                    <input type="text" value={copyrightData.text || ''} onChange={e => setCopyrightData({...copyrightData, text: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
            </SettingsCard>
        </div>
    );
}

const SecuritySettings = ({ settings, onSave, loading }) => {
    const [rateLimiterData, setRateLimiterData] = useState(settings.rateLimiter || {});
    const [passwordData, setPasswordData] = useState({ userId: '', newPassword: '', adminNote: '' });
    const [users, setUsers] = useState<User[]>([]);
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        setRateLimiterData(settings.rateLimiter || {});
        const fetchUsers = async () => {
            const data = await adminAPI.getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, [settings]);

    const filteredUsers = userSearch 
        ? users.filter(u => (u.fullName || u.name || '').toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).slice(0, 5) 
        : [];
    
    return (
        <div className="space-y-6">
            <SettingsCard title="Rate Limiting" description="Protect against brute-force attacks." icon={<FiClock size={24} />} footer={
                <Button onClick={() => onSave({ type: 'rateLimiter', data: rateLimiterData })} disabled={loading.rateLimiter}>
                    {loading.rateLimiter ? <><FiLoader className="animate-spin mr-2"/>Saving...</> : <><FiSave className="mr-2"/>Save Rate Limiter</>}
                </Button>
            }>
                <FormRow label="Window (milliseconds)">
                    <input type="number" value={rateLimiterData.windowMs || ''} onChange={e => setRateLimiterData({...rateLimiterData, windowMs: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
                <FormRow label="Max Requests per Window">
                    <input type="number" value={rateLimiterData.maxRequests || ''} onChange={e => setRateLimiterData({...rateLimiterData, maxRequests: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
            </SettingsCard>
            
            <SettingsCard title="Change User Password" description="Manually reset a password for any user." icon={<FiKey size={24} />} footer={
                 <Button onClick={() => onSave({ type: 'password', data: passwordData })} disabled={loading.password || !passwordData.userId || !passwordData.newPassword}>
                    {loading.password ? <><FiLoader className="animate-spin mr-2"/>Saving...</> : <><FiSave className="mr-2"/>Change Password</>}
                </Button>
            }>
                <FormRow label="Find User">
                    <input type="search" placeholder="Search by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold"/>
                    {userSearch && (
                        <ul className="border rounded-md mt-1 max-h-40 overflow-y-auto">
                            {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                <li key={u._id} onClick={() => { setPasswordData({...passwordData, userId: u._id}); setUserSearch(`${u.fullName || u.name} (${u.email})`); }} className="p-2 hover:bg-gray-100 dark:hover:bg-brand-dark cursor-pointer">{u.fullName || u.name} ({u.email})</li>
                            )) : <li className="p-2 text-gray-500">No users found.</li>}
                        </ul>
                    )}
                </FormRow>
                <FormRow label="New Password">
                    <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
                 <FormRow label="Admin Note (Optional)">
                    <input type="text" value={passwordData.adminNote} onChange={e => setPasswordData({...passwordData, adminNote: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold" />
                </FormRow>
            </SettingsCard>
        </div>
    );
};

const SystemSettings = ({ settings, onSave, loading }) => {
    const [envData, setEnvData] = useState(settings.environment || {});
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    useEffect(() => {
        setEnvData(settings.environment || {});
    }, [settings]);

    const modalAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };
    const modalContentAnimation = {
        initial: { opacity: 0, y: -50, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -50, scale: 0.95 }
    };

    return (
        <div className="space-y-6">
            <SettingsCard title="Environment Variables" description="Core system configuration. Changes require a server restart." icon={<FiCpu size={24} />} footer={
                <Button onClick={() => onSave({ type: 'environment', data: envData })} disabled={loading.environment}>
                    {loading.environment ? <><FiLoader className="animate-spin mr-2"/>Saving...</> : <><FiSave className="mr-2"/>Save Environment</>}
                </Button>
            }>
                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-md" role="alert">
                    <p className="font-bold">Warning!</p>
                    <p>Changing these values can break your application. Proceed with caution. A server restart is required for changes to take effect.</p>
                </div>
                {Object.entries(envData).map(([key, value]) => (
                     <FormRow key={key} label={key}>
                        <input type="text" value={value as string} onChange={e => setEnvData({...envData, [key]: e.target.value})} className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold font-mono" />
                    </FormRow>
                ))}
            </SettingsCard>

            <SettingsCard title="System Reset" description="Reset all settings to their default values. This action is irreversible." icon={<FiTrash2 size={24} />}>
                <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                    <p className="font-bold">Danger Zone</p>
                    <p>This will reset all platform settings. This cannot be undone.</p>
                </div>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10" onClick={() => setIsResetModalOpen(true)}>Reset All Settings</Button>
            </SettingsCard>
            
            <AnimatePresence>
            {isResetModalOpen && (
                 <motion.div
                    {...modalAnimation}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setIsResetModalOpen(false)}
                >
                    <motion.div
                        {...modalContentAnimation}
                        className="bg-white dark:bg-brand-dark-200 rounded-lg shadow-xl w-full max-w-md m-4 relative"
                        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                    >
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                                <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="mt-5 text-lg font-medium leading-6 text-gray-900 dark:text-white">Reset All Settings?</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to reset all system settings to their defaults? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                         <div className="flex items-center justify-center p-6 space-x-3 bg-gray-50 dark:bg-brand-dark rounded-b-lg">
                            <Button type="button" variant="ghost" onClick={() => setIsResetModalOpen(false)}>Cancel</Button>
                            <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500 !border-red-600" onClick={() => { onSave({type: 'reset'}); setIsResetModalOpen(false); }}>
                                {loading.reset ? 'Resetting...' : 'Yes, Reset Settings'}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({ branding: false, rateLimiter: false, password: false, environment: false, reset: false });

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (['general', 'security', 'system'].includes(hash)) {
            setActiveTab(hash as SettingsTab);
        } else {
            setActiveTab('general');
        }
    }, [location.hash]);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminAPI.settingsAPI.getSettings();
            const settingsData = response.data || response.settings || response;
            
            // Transform backend settings structure to frontend expected structure
            const transformedSettings = {
                branding: settingsData.branding || {},
                contact: {
                    email: settingsData.legal?.contact_email || settingsData.contact?.email || '',
                    phone: settingsData.legal?.contact_phone || settingsData.contact?.phone || '',
                    address: settingsData.legal?.contact_address || settingsData.contact?.address || ''
                },
                copyright: {
                    text: settingsData.legal?.copyright_text || settingsData.copyright?.text || ''
                },
                rateLimiter: {
                    windowMs: settingsData.rate_limiting?.window_minutes ? settingsData.rate_limiting.window_minutes * 60 * 1000 : 900000,
                    maxRequests: settingsData.rate_limiting?.max_requests || 100,
                    message: 'Too many requests, please try again later'
                },
                environment: settingsData.environment || {}
            };
            
            setSettings(transformedSettings);
        } catch (error: any) {
            addToast(error.message || 'Failed to load settings.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async ({ type, data }: { type: string, data?: any }) => {
        setSaving(prev => ({ ...prev, [type]: true }));
        try {
            switch (type) {
                case 'branding':
                    // Update branding settings
                    await adminAPI.settingsAPI.updateBranding({
                        site_name: data.branding.siteName,
                        primary_color: data.branding.primaryColor,
                        secondary_color: data.branding.secondaryColor
                    });
                    
                    // Update contact and copyright (stored in legal category)
                    await adminAPI.settingsAPI.updateContact({
                        contact_email: data.contact.email,
                        contact_phone: data.contact.phone,
                        contact_address: data.contact.address,
                        copyright_text: data.copyright.text
                    });
                    
                    if (data.logo) {
                        const formData = new FormData();
                        formData.append('logo', data.logo);
                        await adminAPI.settingsAPI.uploadLogo(formData);
                    }
                    if (data.favicon) {
                        const formData = new FormData();
                        formData.append('favicon', data.favicon);
                        await adminAPI.settingsAPI.uploadFavicon(formData);
                    }
                    addToast('General settings saved!', 'success');
                    break;
                case 'rateLimiter':
                    await adminAPI.settingsAPI.updateRateLimiter({
                        window_minutes: Math.round(data.windowMs / (60 * 1000)),
                        max_requests: data.maxRequests
                    });
                    addToast('Rate limiter settings saved!', 'success');
                    break;
                case 'password':
                    await adminAPI.settingsAPI.changeUserPassword(data.userId, {
                        newPassword: data.newPassword,
                        adminNote: data.adminNote
                    });
                    addToast('User password changed successfully!', 'success');
                    break;
                case 'environment':
                    await adminAPI.settingsAPI.updateEnvironment(data);
                    addToast('Environment settings saved!', 'success');
                    break;
                case 'reset':
                     await adminAPI.settingsAPI.resetSettings({ confirmReset: true, resetType: 'all' });
                     addToast('System settings have been reset.', 'success');
                     break;
            }
            await fetchSettings(); // Refresh data
        } catch (error: any) {
            addToast(error.message || `Failed to save ${type} settings.`, 'error');
        } finally {
            setSaving(prev => ({ ...prev, [type]: false }));
        }
    };
    
    const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { id: 'general', label: 'General', icon: <FiSliders /> },
        { id: 'security', label: 'Security', icon: <FiShield /> },
        { id: 'system', label: 'System', icon: <FiHardDrive /> },
    ];
    
    if (loading) {
        return <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin h-8 w-8 text-brand-gold"/></div>
    }

    if (!settings) {
         return <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg"><FiAlertCircle className="inline mr-2"/>Failed to load settings data. Please try again.</div>;
    }

    const tabAnimation = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Platform Settings</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Navigation */}
                <nav className="flex lg:flex-col lg:w-1/4 xl:w-1/5 space-x-2 lg:space-x-0 lg:space-y-1" aria-label="Tabs">
                    {tabs.map(tab => (
                        <Link
                            key={tab.id}
                            to={`#${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 font-medium text-sm rounded-lg transition-colors
                            ${activeTab === tab.id
                                ? 'bg-brand-gold/10 text-brand-gold'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-dark-200'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </Link>
                    ))}
                </nav>

                {/* Tab Content */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            {...tabAnimation}
                        >
                            {activeTab === 'general' && <GeneralSettings settings={settings} onSave={handleSave} loading={saving.branding} />}
                            {activeTab === 'security' && <SecuritySettings settings={settings} onSave={handleSave} loading={{ rateLimiter: saving.rateLimiter, password: saving.password }} />}
                            {activeTab === 'system' && <SystemSettings settings={settings} onSave={handleSave} loading={{ environment: saving.environment, reset: saving.reset }} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;