
import React from 'react';
import SectionWrapper from '../components/SectionWrapper.tsx';
import { IMPACT_STORIES } from '../constants.ts';
import Counter from '../components/Counter.tsx';
import { FiUsers, FiHeart, FiDroplet, FiBookOpen } from 'react-icons/fi';

const ImpactStatCard = ({ icon, value, label, suffix = '' }: { icon: React.ReactNode, value: number, label: string, suffix?: string }) => (
    <div className="bg-white dark:bg-brand-dark-200 p-6 rounded-lg shadow-lg text-center">
        <div className="text-brand-gold mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-brand-gold/10 mb-4">
            {icon}
        </div>
        <p className="text-4xl md:text-5xl font-bold font-serif text-navy-blue dark:text-white">
            <Counter target={value} />{suffix}
        </p>
        <p className="text-warm-gray-600 dark:text-gray-400 mt-2 text-lg">{label}</p>
    </div>
);

const ImpactPage: React.FC = () => {
  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans">
        {/* Page Header */}
        <div className="bg-brand-deep-blue text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <SectionWrapper>
                <h1 className="text-4xl md:text-5xl font-extrabold font-serif">Our Impact</h1>
                <p className="mt-4 text-xl text-brand-gold">Every Donation Creates a Story of Change.</p>
            </SectionWrapper>
            </div>
        </div>

        {/* Stats Section */}
        <SectionWrapper className="py-20 -mt-16 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ImpactStatCard icon={<FiUsers size={32}/>} value={25000} label="Lives Touched" suffix="+"/>
                    <ImpactStatCard icon={<FiHeart size={32}/>} value={150} label="Projects Funded" suffix="+"/>
                    <ImpactStatCard icon={<FiDroplet size={32}/>} value={50000} label="Liters of Clean Water" suffix="+"/>
                    <ImpactStatCard icon={<FiBookOpen size={32}/>} value={10000} label="Educational Kits" suffix="+"/>
                </div>
            </div>
        </SectionWrapper>
        
        {/* Impact Stories */}
        <SectionWrapper className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Stories of Change</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-warm-gray-600 dark:text-gray-400">
                        Behind every number is a life changed. Here are a few stories from the communities you've supported.
                    </p>
                </div>

                <div className="mt-16 space-y-20">
                    {IMPACT_STORIES.map((story, index) => (
                        <div key={story.id} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
                            <div className={`rounded-lg overflow-hidden shadow-2xl aspect-w-4 aspect-h-3 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                                <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                            </div>
                            <div className={index % 2 !== 0 ? 'md:col-start-1' : ''}>
                                <span className="inline-block bg-brand-gold/20 text-brand-gold font-semibold px-3 py-1 rounded-full text-sm mb-4">{story.campaignCategory}</span>
                                <h3 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">{story.title}</h3>
                                <p className="mt-4 text-lg text-warm-gray-700 dark:text-gray-300">
                                    {story.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    </div>
  );
};

export default ImpactPage;
