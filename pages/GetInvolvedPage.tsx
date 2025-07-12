
import React from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from '../components/SectionWrapper.tsx';
import Button from '../components/Button.tsx';
import { FiGift, FiBriefcase, FiUsers, FiArrowRight } from 'react-icons/fi';

const InvolvementCard = ({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link: string, linkText: string }) => (
    <div className="bg-white dark:bg-brand-dark-200 rounded-lg shadow-lg p-8 h-full flex flex-col text-center items-center">
        <div className="text-brand-gold bg-brand-gold/10 rounded-full p-4 mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold font-serif text-navy-blue dark:text-white">{title}</h3>
        <p className="mt-4 text-warm-gray-600 dark:text-gray-400 flex-grow">{description}</p>
        <div className="mt-8">
            <Button to={link} variant="outline">{linkText} <FiArrowRight className="ml-2"/></Button>
        </div>
    </div>
);

const GetInvolvedPage: React.FC = () => {
    return (
        <div className="bg-brand-light dark:bg-brand-dark font-sans">
            {/* Page Header */}
            <div className="bg-brand-deep-blue text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <SectionWrapper>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-serif">Get Involved</h1>
                    <p className="mt-4 text-xl text-brand-gold">You have the power to create change. Here's how.</p>
                </SectionWrapper>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <SectionWrapper>
                    <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                        <InvolvementCard 
                            icon={<FiGift size={32} />}
                            title="Donate"
                            description="Your contribution, big or small, can transform lives. Support a verified campaign today and see the direct impact of your generosity."
                            link="/explore"
                            linkText="Find a Cause"
                        />
                         <InvolvementCard 
                            icon={<FiBriefcase size={32} />}
                            title="Partner with Us"
                            description="We welcome NGOs and corporate partners to join our mission. Let's collaborate to amplify our impact and fulfill your social responsibility goals."
                            link="/join-us"
                            linkText="Become a Partner"
                        />
                         <InvolvementCard 
                            icon={<FiUsers size={32} />}
                            title="Volunteer"
                            description="Lend your skills and time to support our mission. From on-ground events to digital campaigns, your help is invaluable. (Feature coming soon!)"
                            link="/contact"
                            linkText="Contact Us"
                        />
                    </div>
                </SectionWrapper>
            </div>
        </div>
    );
};

export default GetInvolvedPage;
