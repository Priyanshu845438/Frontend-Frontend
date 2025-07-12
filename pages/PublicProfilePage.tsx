
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SectionWrapper from '../components/SectionWrapper.tsx';
import Button from '../components/Button.tsx';
import { organizationAPI } from '../services/api.ts';
import type { User, Campaign } from '../types.ts';
import { FiMail, FiGlobe, FiMapPin, FiAward, FiShield } from 'react-icons/fi';
import CampaignCard from '../components/CampaignCard.tsx';

const PublicProfilePage: React.FC = () => {
  const { ngoId } = useParams<{ ngoId: string }>();

  const [profile, setProfile] = useState<{ user: User, campaigns: Campaign[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ngoId) {
      setError("NGO ID not provided.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await organizationAPI.getNgoProfile(ngoId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Could not find organization profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [ngoId]);

  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-navy-blue dark:text-white">{error || 'Organization not found'}</h2>
        <p className="mt-4 text-warm-gray-600 dark:text-gray-400">The profile you are looking for does not exist.</p>
        <div className="mt-6">
          <Button to="/explore">Back to Explore</Button>
        </div>
      </div>
    );
  }
  
  const { user, campaigns } = profile;

  return (
    <div className="bg-warm-gray dark:bg-brand-dark-200 font-sans">
      <div className="bg-white dark:bg-brand-dark shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 flex flex-col md:flex-row items-center gap-8">
                <img className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-gold shadow-lg" src={user.avatar} alt={user.name} />
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold font-serif text-navy-blue dark:text-white">{user.name}</h1>
                    <p className="text-xl text-warm-gray-600 dark:text-gray-300 capitalize">{user.profile?.ngoType || user.role}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start space-x-4 text-warm-gray-600 dark:text-gray-400">
                        {user.profile?.address && <span className="flex items-center"><FiMapPin className="mr-2"/>{user.profile.address}</span>}
                        {user.email && <a href={`mailto:${user.email}`} className="flex items-center hover:text-brand-gold"><FiMail className="mr-2"/>Email</a>}
                        {user.profile?.website && <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-brand-gold"><FiGlobe className="mr-2"/>Website</a>}
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionWrapper>
          <div className="bg-white dark:bg-brand-dark p-8 rounded-lg shadow-lg">
             <h2 className="text-2xl font-bold font-serif text-navy-blue dark:text-white mb-4">About {user.name}</h2>
             <p className="text-lg text-warm-gray-700 dark:text-gray-300 leading-relaxed">
                {user.profile?.description || 'This organization has not yet provided a description.'}
             </p>
             <div className="mt-6 pt-6 border-t dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                {user.profile?.is80GCertified && <div className="flex items-center gap-2"><FiAward className="text-green-500"/>80G Certified</div>}
                {user.profile?.is12ACertified && <div className="flex items-center gap-2"><FiAward className="text-green-500"/>12A Certified</div>}
                {user.profile?.registrationNumber && <div className="flex items-center gap-2"><FiShield className="text-blue-500"/>Reg No: {user.profile.registrationNumber}</div>}
             </div>
          </div>
        </SectionWrapper>
        
        {campaigns.length > 0 && (
            <SectionWrapper className="mt-16">
                <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white mb-8 text-center">Campaigns by {user.name}</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map(campaign => (
                        <CampaignCard key={campaign._id} campaign={campaign} />
                    ))}
                </div>
            </SectionWrapper>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;
