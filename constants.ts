
import type { User, Testimonial, TeamMember, PolicyDocument, PolicyContent, Partner, FaqItem, ImpactStory } from './types.ts';

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: 'Priya Sharma', role: 'Monthly Donor', quote: 'This platform makes it so easy to find and support causes I care about. The transparency and regular updates give me confidence that my contributions are making a real difference.', avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: 2, name: 'Rohan Verma', role: 'NGO Partner', quote: 'As a small NGO, getting visibility was a challenge. Partnering with this platform has connected us with a wider community of supporters and amplified our impact significantly.', avatar: 'https://i.pravatar.cc/150?u=rohan' },
  { id: 3, name: 'Anjali Desai', role: 'Corporate Sponsor', quote: 'Our company\'s CSR initiatives have been streamlined through this platform. The detailed reporting and verified campaigns align perfectly with our goal of responsible corporate citizenship.', avatar: 'https://i.pravatar.cc/150?u=anjali' },
];

export const TEAM_MEMBERS: TeamMember[] = [
    { id: 1, name: 'Aarav Mehta', role: 'Founder & CEO', imageUrl: 'https://i.pravatar.cc/400?u=aarav' },
    { id: 2, name: 'Saanvi Gupta', role: 'Head of Operations', imageUrl: 'https://i.pravatar.cc/400?u=saanvi' },
    { id: 3, name: 'Vikram Singh', role: 'Chief Technology Officer', imageUrl: 'https://i.pravatar.cc/400?u=vikram' },
    { id: 4, name: 'Diya Patel', role: 'Head of Partnerships', imageUrl: 'https://i.pravatar.cc/400?u=diya' },
];

export const LEGAL_DOCS: PolicyDocument[] = [
    { id: '80g', title: '80G Certificate', url: '#', description: 'Tax exemption for donors.', category: 'Legal' },
    { id: '12a', title: '12A Certificate', url: '#', description: 'Trust income exemption.', category: 'Legal' },
    { id: 'csr', title: 'CSR-1 Certificate', url: '#', description: 'Eligible for CSR funding.', category: 'Legal' },
    { id: 'pan', title: 'Organization PAN', url: '#', description: 'Permanent Account Number.', category: 'Legal' },
    { id: 'ar2023', title: 'Annual Report 2023', url: '#', description: 'Our activities and financials for FY 2022-23.', category: 'Financial' },
    { id: 'fs2023', title: 'Financial Statement 2023', url: '#', description: 'Audited financial statements for FY 2022-23.', category: 'Financial' },
];

export const POLICY_CONTENTS: Record<string, PolicyContent> = {
    'privacy-policy': {
        title: 'Privacy Policy',
        content: 'Our Privacy Policy outlines how we collect, use, and protect your personal information. We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.'
    },
    'terms-conditions': {
        title: 'Terms and Conditions',
        content: 'Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website.'
    },
    'refund-policy': {
        title: 'Refund Policy',
        content: 'Donations made through our platform are generally non-refundable. However, if a campaign is cancelled or in case of a processing error, we will work with you to ensure your donation is redirected or refunded as appropriate. Please contact our support team for any queries regarding refunds.'
    },
    'donation-usage-policy': {
        title: 'Donation Usage Policy',
        content: 'We are committed to transparency in how donations are used. A small percentage of each donation is used to cover platform fees and operational costs, enabling us to continue our work. The vast majority of your donation goes directly to the specified campaign or NGO. Detailed breakdowns are provided on the donation page and in your receipts.'
    }
};

export const PARTNERS: Partner[] = [
    { id: 1, name: 'Tech Solutions Inc.', logoUrl: 'https://logo.clearbit.com/techcrunch.com', type: 'Corporate' },
    { id: 2, name: 'Innovate Corp', logoUrl: 'https://logo.clearbit.com/intel.com', type: 'Corporate' },
    { id: 3, name: 'Global Health Foundation', logoUrl: 'https://logo.clearbit.com/gatesfoundation.org', type: 'Foundation' },
    { id: 4, name: 'Green Earth Fund', logoUrl: 'https://logo.clearbit.com/worldwildlife.org', type: 'Foundation' },
    { id: 5, 'name': 'National Education Initiative', logoUrl: 'https://logo.clearbit.com/harvard.edu', type: 'Institutional' },
    { id: 6, 'name': 'Startup Hub', logoUrl: 'https://logo.clearbit.com/ycombinator.com', type: 'Institutional' },
];

export const FAQS: FaqItem[] = [
    {
        category: "General",
        question: "What is DonationHub?",
        answer: "DonationHub is a secure online platform that connects verified non-governmental organizations (NGOs) with generous donors and corporate partners. Our mission is to foster a transparent and trustworthy ecosystem for philanthropy in India."
    },
    {
        category: "Donors",
        question: "How do I know my donation is safe?",
        answer: "We use industry-standard payment gateways like Stripe and Razorpay to ensure every transaction is secure. Furthermore, we only partner with NGOs that have been rigorously verified by our team for legal compliance and operational transparency."
    },
    {
        category: "Donors",
        question: "Can I get a tax deduction for my donation?",
        answer: "Yes! Most campaigns on our platform are run by NGOs that are 80G certified. Donations to these campaigns are eligible for a 50% tax deduction under the Income Tax Act. Ensure you provide your PAN number during donation to receive the tax receipt."
    },
    {
        category: "NGOs & Partners",
        question: "How can my NGO partner with DonationHub?",
        answer: "We're thrilled you want to join! Please visit our 'Join Us' page and sign up as an NGO. You will be required to submit your organization's legal documents (like 12A, 80G, CSR-1 certificates) for verification. Our team will guide you through the process."
    },
    {
        category: "NGOs & Partners",
        question: "What are the platform fees?",
        answer: "We believe in maximizing the impact of every donation. Therefore, we do not charge any platform fees to our partner NGOs. A small processing fee is added to the donor's contribution to cover payment gateway charges and help maintain the platform."
    },
    {
        category: "Technical",
        question: "I'm having trouble with the website. What should I do?",
        answer: "We're sorry to hear that. Please try clearing your browser's cache or using a different browser. If the problem persists, please contact our support team through the 'Contact Us' page with details of the issue, and we'll be happy to assist you."
    }
];

export const IMPACT_STORIES: ImpactStory[] = [
    { id: 1, title: "Lighting Up a Village", description: "Through our 'Rural Electrification' drive, we brought sustainable solar power to over 500 homes in remote villages, transforming lives and enabling children to study after dark.", campaignCategory: "Environment", imageUrl: "https://images.unsplash.com/photo-1509395062183-035dc04223d7?q=80&w=800" },
    { id: 2, title: "Mid-Day Meals for 1,000 Students", description: "Our partnership with local schools ensured that 1,000 underprivileged children received nutritious mid-day meals every day for a year, boosting attendance and health.", campaignCategory: "Education", imageUrl: "https://images.unsplash.com/photo-1594705598194-ab6297388a18?q=80&w=800" },
    { id: 3, title: "Clean Water Access for Communities", description: "We successfully installed 15 community water purification plants, providing access to safe and clean drinking water for over 10,000 people and reducing waterborne diseases.", campaignCategory: "Healthcare", imageUrl: "https://images.unsplash.com/photo-1593113646773-69316954a781?q=80&w=800" }
];

/**
 * @deprecated Mock data, will be removed once all modules are updated. Exported to prevent legacy import errors.
 */
export const USERS: User[] = [];
