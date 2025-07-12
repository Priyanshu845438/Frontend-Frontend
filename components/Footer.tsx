
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiArrowRight } from 'react-icons/fi';
import { useToast } from '../context/ToastContext.tsx';
import { publicAPI } from '../services/api.ts';

const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { addToast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribing(true);
    try {
      await publicAPI.subscribeNewsletter({ email: newsletterEmail });
      addToast('Thank you for subscribing!', 'success');
      setNewsletterEmail('');
    } catch (error: any) {
      addToast(error.message || 'Subscription failed.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
    <li>
      <Link to={to} className="text-gray-300 hover:text-brand-gold transition-colors duration-200">{children}</Link>
    </li>
  );

  return (
    <footer className="bg-brand-deep-blue text-gray-200 font-sans">
      <div className="max-w-screen-xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <FiHeart className="h-8 w-8 text-brand-gold" />
              <span className="text-2xl font-bold text-white font-serif">DonationHub</span>
            </Link>
            <p className="text-sm text-gray-400">
              A registered non-profit organization dedicated to creating a transparent and impactful philanthropic ecosystem.
            </p>
             <form className="mt-4" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="block text-sm font-semibold text-white mb-2">Subscribe to our newsletter</label>
              <div className="flex">
                <input 
                    type="email" 
                    id="newsletter-email" 
                    placeholder="Your email address" 
                    value={newsletterEmail} 
                    onChange={e => setNewsletterEmail(e.target.value)} 
                    disabled={isSubscribing}
                    required
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-transparent rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-gold" 
                />
                <button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="p-2 bg-brand-gold text-white rounded-r-md hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:bg-gray-500"
                >
                    <FiArrowRight size={20}/>
                </button>
              </div>
            </form>
          </div>
          
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">About Us</h3>
                <ul className="mt-4 space-y-3">
                  <FooterLink to="/about">Our Story</FooterLink>
                  <FooterLink to="/impact">Impact</FooterLink>
                  <FooterLink to="/partners">Partners</FooterLink>
                  <FooterLink to="/contact">Contact</FooterLink>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Get Involved</h3>
                <ul className="mt-4 space-y-3">
                  <FooterLink to="/explore">Explore Campaigns</FooterLink>
                  <FooterLink to="/donate">Donate Now</FooterLink>
                  <FooterLink to="/join-us">For NGOs & Companies</FooterLink>
                  <FooterLink to="/get-involved">Volunteer</FooterLink>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Transparency</h3>
                <ul className="mt-4 space-y-3">
                  <FooterLink to="/faq">FAQ</FooterLink>
                  <FooterLink to="/transparency">Policies</FooterLink>
                  <FooterLink to="/transparency">Annual Reports</FooterLink>
                  <FooterLink to="/transparency">Legal Documents</FooterLink>
                </ul>
              </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400 md:order-1">&copy; {new Date().getFullYear()} Donation Hub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 md:order-2">
            <a href="#" className="text-gray-400 hover:text-brand-gold"><span className="sr-only">LinkedIn</span><FiLinkedin className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-gold"><span className="sr-only">Twitter</span><FiTwitter className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-gold"><span className="sr-only">Facebook</span><FiFacebook className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-gold"><span className="sr-only">Instagram</span><FiInstagram className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
