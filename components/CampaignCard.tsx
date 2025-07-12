
import React from 'react';
import type { Campaign } from '../types.ts';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.tsx';
import { FiCheckCircle, FiMapPin, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentage = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <motion.div 
        className="bg-white dark:bg-brand-dark-200 rounded-lg shadow-md overflow-hidden flex flex-col group"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"}}
        transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Link to={`/campaign/${campaign.id}`} className="block overflow-hidden">
          <img className="h-56 w-full object-cover transform group-hover:scale-105 transition-transform duration-300" src={campaign.images[0]} alt={campaign.title} />
        </Link>
        <div className="absolute top-3 right-3 flex items-center gap-2">
            {campaign.urgent && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Urgent</span>}
            {campaign.verified && <FiCheckCircle title="Verified NGO" className="h-6 w-6 text-white bg-green-500 rounded-full p-0.5" />}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-warm-gray-600 dark:text-gray-400 mb-2 gap-x-4">
            <span className="flex items-center gap-1"><FiTag size={12}/> {campaign.category}</span>
            <span className="flex items-center gap-1"><FiMapPin size={12}/> {campaign.location}</span>
        </div>
        <h3 className="text-lg font-serif font-bold text-navy-blue dark:text-white mb-2 flex-grow">
          <Link to={`/campaign/${campaign.id}`} className="hover:text-brand-gold transition-colors">{campaign.title}</Link>
        </h3>
        <div className="flex items-center mb-4">
            <img className="h-6 w-6 rounded-full object-cover mr-2" src={campaign.organizerLogo} alt={campaign.organizer} />
            <span className="text-sm font-medium text-warm-gray-600 dark:text-gray-400">by {campaign.organizer}</span>
        </div>
        
        <div className="mt-auto">
            <ProgressBar value={percentage} />
            <div className="flex justify-between text-sm font-semibold text-navy-blue dark:text-gray-100 mt-2">
            <span>₹{campaign.raised.toLocaleString()} <span className="font-normal text-warm-gray-600 dark:text-gray-400">raised</span></span>
            <span className="text-brand-gold">{percentage}%</span>
            </div>
            <Link to={`/campaign/${campaign.id}`} className="mt-4 w-full text-center inline-block bg-brand-gold text-white font-bold py-2 px-4 rounded-md hover:bg-brand-gold/90 transition-colors">
                Donate Now
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
