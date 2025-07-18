
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiLinkedin, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';
import { publicAPI, API_SERVER_URL } from '../services/api.ts';

interface FooterSettings {
  branding: {
    siteName?: string;
    logo?: string;
  };
  contact: {
    address?: string;
  };
  copyright: {
    text?: string;
  };
}

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<FooterSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await publicAPI.getSettings();
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        // Silently fail as the component has fallbacks.
        // console.error("Failed to fetch public settings for footer:", error);
      }
    };
    // Disabling dynamic settings fetch for now as the endpoint is not available.
    // fetchSettings(); 
  }, []);

  const siteName = settings?.branding?.siteName || 'Donation Hub';
  const address = settings?.contact?.address || '123 Charity Lane, New Delhi, 110001, India';
  const copyrightText = settings?.copyright?.text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const logoUrl = settings?.branding?.logo ? `${API_SERVER_URL}${settings.branding.logo}` : null;

  return (
    <footer className="bg-navy-blue text-warm-gray-200 font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              {logoUrl ? 
                <img src={logoUrl} alt={`${siteName} logo`} className="h-8 w-auto" /> 
                : 
                <FiHeart className="h-8 w-8 text-sky-blue" />
              }
              <span className="text-xl font-bold text-white font-serif">{siteName}</span>
            </Link>
            <p className="text-sm text-warm-gray-300">
              Connecting communities, creating change.
            </p>
            <p className="text-sm text-warm-gray-300">
              {address}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-warm-gray-100 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-base text-warm-gray-300 hover:text-sky-blue">About Us</Link></li>
              <li><Link to="/explore" className="text-base text-warm-gray-300 hover:text-sky-blue">Campaigns</Link></li>
              <li><Link to="/donate" className="text-base text-warm-gray-300 hover:text-sky-blue">Donate</Link></li>
              <li><Link to="/contact" className="text-base text-warm-gray-300 hover:text-sky-blue">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-warm-gray-100 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/legal" className="text-base text-warm-gray-300 hover:text-sky-blue">Privacy Policy</Link></li>
              <li><Link to="/legal" className="text-base text-warm-gray-300 hover:text-sky-blue">Terms & Conditions</Link></li>
              <li><Link to="/legal" className="text-base text-warm-gray-300 hover:text-sky-blue">Refund Policy</Link></li>
              <li><Link to="/legal" className="text-base text-warm-gray-300 hover:text-sky-blue">Transparency</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-warm-gray-100 tracking-wider uppercase">Subscribe to our newsletter</h3>
            <p className="mt-4 text-base text-warm-gray-300">Get the latest updates on campaigns and our impact.</p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="newsletter-email-address" className="sr-only">Email address</label>
              <input type="email" name="newsletter-email-address" id="newsletter-email-address" autoComplete="email" required className="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-warm-gray-900 placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-blue" placeholder="Enter your email" />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button type="submit" className="w-full bg-sky-blue flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-sky-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-blue">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-warm-gray-700 pt-8 flex items-center justify-between">
          <p className="text-base text-warm-gray-400">{copyrightText}</p>
          <div className="flex space-x-6">
            <a href="#" className="text-warm-gray-400 hover:text-sky-blue"><span className="sr-only">LinkedIn</span><FiLinkedin className="h-6 w-6" /></a>
            <a href="#" className="text-warm-gray-400 hover:text-sky-blue"><span className="sr-only">Twitter</span><FiTwitter className="h-6 w-6" /></a>
            <a href="#" className="text-warm-gray-400 hover:text-sky-blue"><span className="sr-only">Facebook</span><FiFacebook className="h-6 w-6" /></a>
            <a href="#" className="text-warm-gray-400 hover:text-sky-blue"><span className="sr-only">Instagram</span><FiInstagram className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;