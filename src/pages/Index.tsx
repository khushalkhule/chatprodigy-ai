
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PricingSection from '@/components/sections/PricingSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ChatbotDemo from '@/components/chat/ChatbotDemo';
import CTAButton from '@/components/ui/CTAButton';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // To handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;
        
        const targetElement = document.querySelector(href);
        if (!targetElement) return;
        
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
          behavior: 'smooth'
        });
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        
        {/* How it works section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How AiReplyr Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Implementation is simple and takes just minutes. No coding required.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  number: '01',
                  title: 'Create Your Chatbot',
                  description: 'Use our intuitive wizard to create and configure your AI chatbot in minutes.'
                },
                {
                  number: '02',
                  title: 'Train with Your Content',
                  description: 'Upload documents, enter text, or let us crawl your website to build a custom knowledge base.'
                },
                {
                  number: '03',
                  title: 'Add to Your Website',
                  description: 'Copy and paste a simple embed code to add the chatbot to your website.'
                }
              ].map((step, index) => (
                <div key={index} className="animate-fade-up" style={{animationDelay: `${index * 150}ms`}}>
                  <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <PricingSection />
        <TestimonialsSection />
        
        {/* CTA Section */}
        <section id="contact" className="py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Customer Experience?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using AiReplyr to automate support, increase conversions, and delight customers 24/7.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <CTAButton href="/signup" size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CTAButton>
                <CTAButton href="/contact" variant="outline" size="lg">
                  Contact Sales
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatbotDemo />
    </div>
  );
};

export default Index;
