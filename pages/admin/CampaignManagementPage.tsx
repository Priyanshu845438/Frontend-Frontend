
import React, { useState, useMemo, useEffect } from 'react';
import { getAdminCampaigns, toggleCampaignStatus } from '../../services/api.ts';
import type { Campaign } from '../../types.ts';
import Button from '../../components/Button.tsx';
import ProgressBar from '../../components/ProgressBar.tsx';
import { FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const CampaignManagementPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const campaignList = await getAdminCampaigns();
      setCampaigns(campaignList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(filter.toLowerCase()) ||
      campaign.organizer.toLowerCase().includes(filter.toLowerCase())
    );
  }, [campaigns, filter]);
  
  const handleToggleStatus = async (campaign: Campaign) => {
    try {
      await toggleCampaignStatus(campaign);
      fetchCampaigns(); // Refresh list
    } catch (err: any) {
      alert(`Failed to toggle status: ${err.message}`);
    }
  };

  const statusBadge = (status: Campaign['status']) => {
      const base = "px-2 py-1 text-xs font-semibold rounded-full";
      switch(status) {
          case 'active': return `${base} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
          case 'completed': return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
          case 'disabled': return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
      }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Campaign Management</h1>
      
       <div className="bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-md flex items-center gap-4">
          <input 
            type="text"
            placeholder="Search by title or organizer..."
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <Button>Add New Campaign</Button>
      </div>

      <div className="bg-white dark:bg-brand-dark-200 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-brand-dark">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-brand-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
            {loading && <tr><td colSpan={4} className="text-center p-4">Loading campaigns...</td></tr>}
            {error && <tr><td colSpan={4} className="text-center p-4 text-red-500">{error}</td></tr>}
            {!loading && !error && filteredCampaigns.map(campaign => {
                const percentage = campaign.goal > 0 ? Math.round((campaign.raised / campaign.goal) * 100) : 0;
                return (
                    <tr key={campaign.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <img className="h-10 w-10 rounded-md object-cover" src={campaign.images[0]} alt={campaign.title} />
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">by {campaign.organizer}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">₹{campaign.raised.toLocaleString()} / ₹{campaign.goal.toLocaleString()}</div>
                            <ProgressBar value={percentage} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={statusBadge(campaign.status)}>{campaign.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <div className="flex justify-end items-center gap-2">
                                <Button onClick={() => handleToggleStatus(campaign)} variant="ghost" className={`p-2 ${campaign.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                    {campaign.isActive ? <FiToggleRight size={20}/> : <FiToggleLeft size={20} />}
                                </Button>
                                <Button variant="ghost" className="p-2 text-blue-500"><FiEdit /></Button>
                                <Button variant="ghost" className="p-2 text-red-500"><FiTrash2 /></Button>
                            </div>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignManagementPage;
