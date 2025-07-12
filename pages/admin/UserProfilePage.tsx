
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminUserById, approveUser, toggleUserStatus } from '../../services/api.ts';
import type { User } from '../../types.ts';
import Button from '../../components/Button.tsx';
import { FiMail, FiPhone, FiCalendar, FiCheck, FiToggleLeft, FiToggleRight, FiArrowLeft } from 'react-icons/fi';

const statusBadge = (status: User['status']) => {
    const base = "px-3 py-1 text-sm font-semibold rounded-full inline-block";
    switch(status) {
        case 'active': return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
        case 'pending': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
        case 'disabled': return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
    }
};

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUser = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const userData = await getAdminUserById(userId);
            if (!userData) {
                throw new Error("User not found.");
            }
            setUser(userData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const handleApprove = async () => {
        if (!user) return;
        try {
            await approveUser(user.id);
            fetchUser(); // Refresh user data
        } catch (err: any) {
            alert(`Failed to approve user: ${err.message}`);
        }
    };

    const handleToggleStatus = async () => {
        if (!user) return;
        try {
            await toggleUserStatus(user);
            fetchUser(); // Refresh user data
        } catch (err: any) {
            alert(`Failed to change status: ${err.message}`);
        }
    };

    if (loading) return <div>Loading user profile...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!user) return <div>User not found.</div>;

    return (
        <div className="space-y-8">
            <Link to="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-gold">
                <FiArrowLeft /> Back to User List
            </Link>

            {/* Header */}
            <div className="bg-white dark:bg-brand-dark-200 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center gap-6">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full ring-4 ring-brand-gold" />
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    <span className={statusBadge(user.status)}>{user.status}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {user.approvalStatus === 'pending' && (
                        <Button onClick={handleApprove} variant="primary"><FiCheck className="mr-2"/>Approve User</Button>
                    )}
                     {user.role !== 'admin' && user.approvalStatus === 'approved' && (
                        <Button onClick={handleToggleStatus} variant="outline" title={user.isActive ? 'Disable User' : 'Enable User'}>
                             {user.isActive ? <FiToggleRight size={20} className="mr-2"/> : <FiToggleLeft size={20} className="mr-2"/>}
                             {user.isActive ? 'Disable' : 'Enable'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="bg-white dark:bg-brand-dark-200 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">User Details</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex items-center gap-3">
                        <FiMail className="text-gray-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                        <a href={`mailto:${user.email}`} className="text-brand-gold hover:underline">{user.email}</a>
                    </div>
                     <div className="flex items-center gap-3">
                        <FiPhone className="text-gray-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                        <span className="text-gray-600 dark:text-gray-400">{user.phoneNumber || 'N/A'}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <FiCalendar className="text-gray-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Joined:</span>
                        <span className="text-gray-600 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <FiCheck className="text-gray-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Approval:</span>
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{user.approvalStatus}</span>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default UserProfilePage;
