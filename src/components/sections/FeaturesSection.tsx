
import React from 'react';
import FeatureCard from '@/components/ui/FeatureCard';
import { 
  Bot, 
  Database, 
  FileText, 
  Globe, 
  MessageSquare, 
  Palette, 
  Sliders, 
  Users 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'AI-Powered Responses',
      description: 'Leverage advanced OpenAI language models to deliver human-like, contextually relevant responses.',
      icon: Bot
    },
    {
      title: 'Custom Knowledge Base',
      description: 'Train your chatbot with your website content, documents, and FAQs for accurate responses.',
      icon: Database
    },
    {
      title: 'Website Integration',
      description: 'Seamlessly integrate with any website with a simple embed code. No coding required.',
      icon: Globe
    },
    {
      title: 'Lead Generation',
      description: 'Capture visitor information with customizable lead forms directly in the chat interface.',
      icon: Users
    },
    {
      title: 'Customizable Design',
      description: 'Match your brand with fully customizable chat widget design, colors, and messaging.',
      icon: Palette
    },
    {
      title: 'Conversation Analytics',
      description: 'Gain insights from chat data, user satisfaction, and conversion metrics in real-time.',
      icon: Sliders
    },
    {
      title: 'Multi-Channel Support',
      description: 'Connect with customers across websites, mobile apps, and popular messaging platforms.',
      icon: MessageSquare
    },
    {
      title: 'Content Training',
      description: 'Upload documents, crawl websites, or input text directly to build your knowledge base.',
      icon: FileText
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Extraordinary Experiences
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to create intelligent, conversational AI experiences that delight your customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
