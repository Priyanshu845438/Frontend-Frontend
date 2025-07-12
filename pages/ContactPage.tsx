
import React, { useState } from 'react';
import SectionWrapper from '../components/SectionWrapper.tsx';
import Button from '../components/Button.tsx';
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiHelpCircle, FiRss } from 'react-icons/fi';
import { useToast } from '../context/ToastContext.tsx';
import { publicAPI } from '../services/api.ts';

const ContactInfoCard = ({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link: string, linkText: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-gold/10 text-brand-gold">
                {icon}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-medium text-navy-blue dark:text-white">{title}</h3>
            <p className="mt-1 text-warm-gray-600 dark:text-gray-400">{description}</p>
            <a href={link} className="mt-2 text-base text-brand-gold font-semibold hover:underline inline-block">{linkText}</a>
        </div>
    </div>
);


const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
        type: 'general',
    };

    try {
        await publicAPI.submitContactForm(data);
        addToast('Message sent successfully! We will get back to you soon.', 'success');
        form.reset();
    } catch (error: any) {
        addToast(error.message || 'Failed to send message.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-light dark:bg-brand-dark font-sans">
      <div className="bg-white dark:bg-brand-dark-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-navy-blue dark:text-white font-serif">Get In Touch</h1>
          <p className="mt-4 text-xl text-warm-gray-600 dark:text-gray-400">We'd love to hear from you. Whether you have a question, feedback, or a partnership inquiry, please reach out.</p>
        </div>
      </div>
      
      <SectionWrapper className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-brand-dark-200 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold font-serif text-navy-blue dark:text-white mb-6">Send us a message</h2>
              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="sr-only">Full name</label>
                        <input type="text" name="name" id="name" autoComplete="name" placeholder="Full name" required className="block w-full shadow-sm py-3 px-4 placeholder-warm-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-brand-gold focus:border-brand-gold border-warm-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input type="email" name="email" id="email" autoComplete="email" placeholder="Email address" required className="block w-full shadow-sm py-3 px-4 placeholder-warm-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-brand-gold focus:border-brand-gold border-warm-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                </div>
                 <div>
                  <label htmlFor="subject" className="sr-only">Subject</label>
                  <input type="text" name="subject" id="subject" autoComplete="off" placeholder="Subject" required className="block w-full shadow-sm py-3 px-4 placeholder-warm-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-brand-gold focus:border-brand-gold border-warm-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea name="message" id="message" rows={5} placeholder="Your Message" required className="block w-full shadow-sm py-3 px-4 placeholder-warm-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-brand-gold focus:border-brand-gold border-warm-gray-300 dark:border-gray-600 rounded-md"></textarea>
                </div>
                <div>
                  <Button type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <ContactInfoCard 
                icon={<FiHelpCircle size={24}/>} 
                title="General Inquiries"
                description="For any general questions about our platform or donations."
                link="mailto:support@donationhub.org"
                linkText="support@donationhub.org"
              />
               <ContactInfoCard 
                icon={<FiBriefcase size={24}/>} 
                title="Partnerships"
                description="If you are an NGO or company interested in partnering with us."
                link="mailto:partners@donationhub.org"
                linkText="partners@donationhub.org"
              />
              <ContactInfoCard 
                icon={<FiRss size={24}/>} 
                title="Press & Media"
                description="For all media-related inquiries, please contact our press team."
                link="mailto:press@donationhub.org"
                linkText="press@donationhub.org"
              />
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-gold/10 text-brand-gold">
                       <FiMapPin size={24}/>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-navy-blue dark:text-white">Our Office</h3>
                    <p className="mt-1 text-warm-gray-600 dark:text-gray-400">123 Charity Lane, New Delhi, 110001, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
      <div className="w-full h-80">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.348632194883!2d77.2195002150822!3d28.61933208242318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd3f24835c6b%3A0x53994a434d720b0a!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1678886561234!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale invert-[0.9] hue-rotate-[180deg]"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
