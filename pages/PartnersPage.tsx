
import React from 'react';
import SectionWrapper from '../components/SectionWrapper.tsx';
import { PARTNERS } from '../constants.ts';
import Button from '../components/Button.tsx';

const PartnerCard = ({ partner }: { partner: typeof PARTNERS[0] }) => (
  <div className="bg-white dark:bg-brand-dark-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center h-48">
    <img src={partner.logoUrl} alt={`${partner.name} logo`} className="max-h-16 max-w-full" />
    <h3 className="mt-4 font-semibold text-navy-blue dark:text-white">{partner.name}</h3>
  </div>
);

const PartnersPage: React.FC = () => {
  const corporatePartners = PARTNERS.filter(p => p.type === 'Corporate');
  const foundationPartners = PARTNERS.filter(p => p.type === 'Foundation');
  const institutionalPartners = PARTNERS.filter(p => p.type === 'Institutional');

  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans">
      {/* Page Header */}
      <div className="bg-brand-deep-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <SectionWrapper>
            <h1 className="text-4xl md:text-5xl font-extrabold font-serif">Our Partners</h1>
            <p className="mt-4 text-xl text-brand-gold">Collaborating for Greater Impact</p>
          </SectionWrapper>
        </div>
      </div>
      
      {/* Partner Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <SectionWrapper>
          <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white text-center mb-10">Corporate Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {corporatePartners.map(partner => <PartnerCard key={partner.id} partner={partner} />)}
          </div>
        </SectionWrapper>
        
        <SectionWrapper>
          <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white text-center mb-10">Foundations & Trusts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {foundationPartners.map(partner => <PartnerCard key={partner.id} partner={partner} />)}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white text-center mb-10">Institutional Supporters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {institutionalPartners.map(partner => <PartnerCard key={partner.id} partner={partner} />)}
          </div>
        </SectionWrapper>
      </div>

      {/* CTA Section */}
      <SectionWrapper className="bg-white dark:bg-brand-dark-200 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-serif text-navy-blue dark:text-white">Become a Partner</h2>
          <p className="mt-4 text-lg text-warm-gray-600 dark:text-gray-400">
            Join our network of esteemed organizations to fulfill your CSR goals and make a lasting social impact. Let's collaborate to build a better future.
          </p>
          <div className="mt-8">
            <Button to="/contact" variant="primary">Partner With Us</Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default PartnersPage;
