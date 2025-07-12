
import React from 'react';
import SectionWrapper from '../components/SectionWrapper.tsx';
import { TEAM_MEMBERS } from '../constants.ts';
import { FiEye, FiTarget, FiUsers, FiHeart, FiCheckCircle } from 'react-icons/fi';

const ValueCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-gold/10 text-brand-gold mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-navy-blue dark:text-white mb-2">{title}</h3>
        <p className="text-warm-gray-600 dark:text-gray-400">{children}</p>
    </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans">
      {/* Page Header */}
      <div className="bg-brand-deep-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <SectionWrapper>
            <h1 className="text-4xl md:text-5xl font-extrabold font-serif">About DonationHub</h1>
            <p className="mt-4 text-xl text-brand-gold">Connecting Generosity with Need, Transparently.</p>
          </SectionWrapper>
        </div>
      </div>

      {/* Our Story Section */}
      <SectionWrapper className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg aspect-w-4 aspect-h-3">
                <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1170&auto=format&fit=crop" alt="Community working together" className="w-full h-full object-cover"/>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Our Story</h2>
              <p className="mt-4 text-lg text-warm-gray-700 dark:text-gray-300">
                DonationHub was founded with a simple yet powerful belief: that technology can bridge the gap between those who want to help and those who need it most. We aim to create a transparent, secure, and accessible platform that empowers individuals and organizations to make a meaningful impact on society.
              </p>
              <p className="mt-4 text-lg text-warm-gray-700 dark:text-gray-300">
                Our journey began in 2023, driven by the need for a more accountable system in online philanthropy. We are dedicated to verifying every campaign, ensuring every rupee is tracked, and providing clear reports on the impact of your generosity.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
      
      {/* Mission and Vision */}
      <SectionWrapper className="bg-white dark:bg-brand-dark-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <div className="flex items-start gap-6">
                <FiTarget className="h-12 w-12 text-brand-gold flex-shrink-0 mt-1"/>
                <div>
                    <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Our Mission</h2>
                    <p className="mt-2 text-lg text-warm-gray-700 dark:text-gray-300">
                        To empower and connect verified NGOs with a community of donors and corporate partners, ensuring every contribution makes a transparent and tangible impact.
                    </p>
                </div>
            </div>
             <div className="flex items-start gap-6">
                <FiEye className="h-12 w-12 text-brand-gold flex-shrink-0 mt-1"/>
                <div>
                    <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Our Vision</h2>
                    <p className="mt-2 text-lg text-warm-gray-700 dark:text-gray-300">
                       To be India's most trusted and effective platform for philanthropy, fostering a culture of giving that transforms communities and uplifts lives.
                    </p>
                </div>
            </div>
        </div>
      </SectionWrapper>
      
      {/* Our Values */}
       <SectionWrapper className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Our Core Values</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-warm-gray-600 dark:text-gray-400">The principles that guide every decision we make.</p>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                <ValueCard icon={<FiCheckCircle size={32}/>} title="Transparency">We operate with complete openness, providing clear financial reporting and impact updates.</ValueCard>
                <ValueCard icon={<FiHeart size={32}/>} title="Empathy">We are driven by a deep understanding of the needs of the communities we serve and the passion of our donors.</ValueCard>
                <ValueCard icon={<FiUsers size={32}/>} title="Integrity">We uphold the highest ethical standards, ensuring every action is responsible and accountable.</ValueCard>
            </div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
      <SectionWrapper className="bg-white dark:bg-brand-dark-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Meet Our Team</h2>
            <p className="mt-4 text-lg text-warm-gray-600 dark:text-gray-400">The passionate individuals driving our mission forward.</p>
          </div>
          <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative w-40 h-40 mx-auto">
                    <img className="mx-auto h-40 w-40 rounded-full object-cover shadow-lg transform group-hover:scale-105 transition-transform duration-300" src={member.imageUrl} alt={member.name} />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-navy-blue dark:text-white">{member.name}</h3>
                  <p className="text-brand-gold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutPage;
