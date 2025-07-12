
import React from 'react';
import SectionWrapper from '../components/SectionWrapper.tsx';
import { LEGAL_DOCS, POLICY_CONTENTS } from '../constants.ts';
import { FiDownload, FiFileText } from 'react-icons/fi';
import type { PolicyContent } from '../types.ts';
import Accordion from '../components/Accordion.tsx';

const DocumentCard = ({ doc }: { doc: typeof LEGAL_DOCS[0] }) => (
    <a 
      href={doc.url}
      download
      className="bg-white dark:bg-brand-dark-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
    >
      <FiDownload className="h-10 w-10 text-brand-gold mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="text-lg font-semibold text-navy-blue dark:text-white">{doc.title}</h3>
      <p className="text-sm text-warm-gray-600 dark:text-gray-400 mt-2 flex-grow">{doc.description}</p>
      <span className="mt-4 text-sm font-bold text-brand-gold">Download PDF</span>
    </a>
);

const TransparencyPage: React.FC = () => {
    const legalDocs = LEGAL_DOCS.filter(d => d.category === 'Legal');
    const financialDocs = LEGAL_DOCS.filter(d => d.category === 'Financial');

  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans">
      <div className="bg-navy-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionWrapper>
            <h1 className="text-4xl font-extrabold text-white font-serif">Transparency Hub</h1>
            <p className="mt-4 text-xl text-warm-gray-200">Our commitment to open, honest, and accountable operations.</p>
          </SectionWrapper>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        
        <SectionWrapper>
          <h2 className="text-3xl font-bold text-navy-blue dark:text-white font-serif text-center mb-10">Financial Reports & Legal Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {financialDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
            {legalDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
          </div>
        </SectionWrapper>
        
        {/* Policies */}
        <SectionWrapper>
          <h2 className="text-3xl font-bold text-navy-blue dark:text-white font-serif text-center mb-12">Our Policies</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {Object.values(POLICY_CONTENTS).map((policy: PolicyContent) => (
              <Accordion key={policy.title} title={policy.title} titleIcon={<FiFileText />}>
                 <div className="prose dark:prose-invert max-w-none">
                    <p>{policy.content}</p>
                 </div>
              </Accordion>
            ))}
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default TransparencyPage;
