
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.tsx';
import CampaignCard from '../components/CampaignCard.tsx';
import SectionWrapper from '../components/SectionWrapper.tsx';
import { TESTIMONIALS, PARTNERS } from '../constants.ts';
import { campaignAPI, publicAPI } from '../services/api.ts';
import type { Campaign } from '../types.ts';
import { FaHandHoldingHeart, FaUsers, FaCheckCircle, FaBuilding } from 'react-icons/fa';
import { FiArrowRight, FiHeart, FiSearch, FiGift } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Counter from '../components/Counter.tsx';

const StatCard = ({ icon, value, label, isCurrency = false }: { icon: React.ReactNode, value: number, label: string, isCurrency?: boolean }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center text-white border border-white/20">
      <div className="text-brand-gold mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white/20 mb-4">
          {icon}
      </div>
      <p className="text-4xl font-bold font-serif">
        {isCurrency && '₹'}
        <Counter target={value} />
        {isCurrency && '+'}
      </p>
      <p className="text-gray-300 mt-1">{label}</p>
    </div>
  );
};


const HomePage: React.FC = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, platformStats] = await Promise.all([
          campaignAPI.getPublic({ sortBy: 'newest', limit: 3 }),
          publicAPI.getPlatformStats()
        ]);
        setFeaturedCampaigns(campaignsData.campaigns);
        setStats(platformStats.stats);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans text-warm-gray-700 dark:text-warm-gray-200">
      {/* Hero Section */}
      <section className="relative text-white h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-wheelchair-receives-a-box-of-food-40118-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-brand-deep-blue/70"></div>
        <div className="relative z-10 p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-extrabold font-serif tracking-tight"
          >
            Giving Hope, <span className="text-brand-gold">One Donation at a Time.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-200"
          >
            Join a community of changemakers. Donate with confidence to transparent, high-impact campaigns verified for your trust.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button to="/explore" variant="primary" className="text-lg">Explore Causes</Button>
            <Button to="/get-involved" variant="outline" className="text-lg border-white text-white hover:bg-white/10">Get Involved</Button>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-brand-royal-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<FaHandHoldingHeart size={24} />} value={stats?.totalRaised || 0} label="Total Donations" isCurrency />
                    <StatCard icon={<FaCheckCircle size={24} />} value={stats?.activeCampaigns || 0} label="Active Campaigns" />
                    <StatCard icon={<FaUsers size={24} />} value={stats?.totalNGOs || 0} label="Verified NGOs" />
                    <StatCard icon={<FaBuilding size={24} />} value={stats?.totalCompanies || 0} label="Corporate Partners" />
                </div>
            </SectionWrapper>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionWrapper>
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-navy-blue dark:text-white">Featured Campaigns</h2>
                    <p className="mt-4 text-lg text-warm-gray-600 dark:text-gray-400">Discover our latest campaigns that need your support.</p>
                </div>
                {loading ? (
                  <div className="text-center py-12">Loading campaigns...</div>
                ) : (
                  <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {featuredCampaigns.map(campaign => (
                          <CampaignCard key={campaign.id} campaign={campaign} />
                      ))}
                  </div>
                )}
                <div className="mt-12 text-center">
                    <Button to="/explore" variant="secondary">View All Campaigns <FiArrowRight className="ml-2"/></Button>
                </div>
              </SectionWrapper>
          </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-brand-dark-200 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-navy-blue dark:text-white">A Simple, Transparent Process</h2>
              <p className="mt-4 text-lg text-warm-gray-600 dark:text-gray-400">Making a difference is just three steps away.</p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-gold/10 text-brand-gold mb-4">
                  <FiSearch size={36} />
                </div>
                <h3 className="text-xl font-bold text-navy-blue dark:text-white mb-2">1. Find a Cause</h3>
                <p className="text-warm-gray-600 dark:text-gray-400">Explore our curated list of verified campaigns across various sectors like education, health, and environment.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-gold/10 text-brand-gold mb-4">
                  <FiGift size={36} />
                </div>
                <h3 className="text-xl font-bold text-navy-blue dark:text-white mb-2">2. Donate Securely</h3>
                <p className="text-warm-gray-600 dark:text-gray-400">Make your contribution through our secure payment gateway. Avail 80G tax benefits on eligible donations.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-gold/10 text-brand-gold mb-4">
                  <FiHeart size={36} />
                </div>
                <h3 className="text-xl font-bold text-navy-blue dark:text-white mb-2">3. See Your Impact</h3>
                <p className="text-warm-gray-600 dark:text-gray-400">Receive regular updates and reports from the campaign you supported. See how your generosity is changing lives.</p>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Testimonials Section */}
       <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-navy-blue dark:text-white">Voices of Our Community</h2>
              <p className="mt-4 text-lg text-warm-gray-600 dark:text-gray-400">See what donors and partners are saying about us.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="bg-white dark:bg-brand-dark-200 p-8 rounded-lg shadow-lg">
                  <p className="text-warm-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  <div className="mt-6 flex items-center">
                    <img className="h-12 w-12 rounded-full" src={testimonial.avatar} alt={testimonial.name} />
                    <div className="ml-4">
                      <p className="font-semibold text-navy-blue dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-warm-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

       {/* Partners Section */}
      <section className="bg-white dark:bg-brand-dark-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionWrapper>
                <h2 className="text-center text-2xl font-bold text-navy-blue dark:text-white mb-2">Our Trusted Partners</h2>
                <p className="text-center text-warm-gray-600 dark:text-gray-400 mb-12">We are proud to collaborate with leading organizations to amplify our impact.</p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {PARTNERS.slice(0, 5).map(partner => (
                        <img key={partner.id} src={partner.logoUrl} alt={partner.name} className="h-10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                    ))}
                </div>
            </SectionWrapper>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-gold">
         <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-brand-deep-blue sm:text-4xl font-serif">
                <span className="block">Ready to make a difference?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-900/80">
                Your generosity can create a ripple of change. Start your journey of giving today.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
                <Button to="/donate" variant="secondary" className="bg-white text-brand-deep-blue hover:bg-gray-100">
                    Donate Now
                </Button>
                <Button to="/join-us" variant="outline" className="border-white text-white hover:bg-white/20">
                    Partner with Us
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
