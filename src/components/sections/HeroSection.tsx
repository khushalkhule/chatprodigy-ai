
import React from 'react';
import CTAButton from '@/components/ui/CTAButton';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute -top-64 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl">
            {/* Eyebrow tag */}
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-fade-down">
              Intelligent AI Chatbots for Your Website
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-down animation-delay-200">
              Transform Your <span className="text-primary">Customer Experience</span> with AI
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-muted-foreground animate-fade-down animation-delay-400">
              Build intelligent AI chatbots for your website in minutes. No coding required.
              Automate support, generate leads, and provide personalized experiences 24/7.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-4 animate-fade-down animation-delay-600">
              <CTAButton href="/signup" size="lg">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </CTAButton>
              <CTAButton href="#demo" variant="outline" size="lg">
                See it in action
              </CTAButton>
            </div>
            
            {/* Social proof */}
            <div className="pt-6 text-sm text-muted-foreground animate-fade-in animation-delay-600">
              <p>Trusted by 1,000+ businesses worldwide</p>
            </div>
          </div>
          
          {/* Hero image/preview */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-60" />
              <img 
                src="/chatbot-dashboard.png" 
                alt="AiReplyr Dashboard" 
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x400?text=AiReplyr+Dashboard';
                }}
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-xl shadow-lg border border-border animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="font-medium">Live Agents</p>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-12 -right-6 p-4 bg-white rounded-xl shadow-lg border border-border animate-float animation-delay-400">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
