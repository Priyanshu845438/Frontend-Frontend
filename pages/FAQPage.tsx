
import React, { useState } from 'react';
import SectionWrapper from '../components/SectionWrapper.tsx';
import Accordion from '../components/Accordion.tsx';
import { FAQS } from '../constants.ts';
import type { FaqItem } from '../types.ts';

const FAQPage: React.FC = () => {
    const categories = ['General', 'Donors', 'NGOs & Partners', 'Technical'];
    const [activeCategory, setActiveCategory] = useState('General');

    const filteredFaqs = FAQS.filter(faq => faq.category === activeCategory);

    return (
        <div className="bg-brand-light dark:bg-brand-dark font-sans">
            {/* Page Header */}
            <div className="bg-white dark:bg-brand-dark-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <SectionWrapper>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-navy-blue dark:text-white font-serif">Frequently Asked Questions</h1>
                    <p className="mt-4 text-xl text-warm-gray-600 dark:text-gray-400">Have questions? We've got answers.</p>
                </SectionWrapper>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <SectionWrapper>
                    {/* Category Tabs */}
                    <div className="mb-12 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeCategory === category
                                    ? 'border-brand-gold text-brand-gold'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                        </nav>
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-4">
                        {filteredFaqs.map((faq: FaqItem, index) => (
                            <Accordion key={index} title={faq.question}>
                                <p className="text-warm-gray-700 dark:text-gray-300 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </Accordion>
                        ))}
                    </div>
                </SectionWrapper>
            </div>
        </div>
    );
};

export default FAQPage;
