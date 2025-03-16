
import React from 'react';
import PricingCard from '@/components/ui/PricingCard';

const PricingSection = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for small websites and startups',
      price: '$29',
      period: 'month',
      features: [
        { text: '1 Chatbot', included: true },
        { text: '500 Chat sessions/month', included: true },
        { text: 'Website integration', included: true },
        { text: 'Basic customization', included: true },
        { text: 'Knowledge base (10MB)', included: true },
        { text: 'Lead generation forms', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'Custom domain', included: false },
      ],
      ctaText: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'For growing businesses and teams',
      price: '$79',
      period: 'month',
      features: [
        { text: '5 Chatbots', included: true },
        { text: '2,500 Chat sessions/month', included: true },
        { text: 'Website integration', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'Knowledge base (50MB)', included: true },
        { text: 'Lead generation forms', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Team collaboration (3 users)', included: true },
        { text: 'Custom domain', included: false },
      ],
      ctaText: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Business',
      description: 'For large businesses with advanced needs',
      price: '$199',
      period: 'month',
      features: [
        { text: 'Unlimited Chatbots', included: true },
        { text: '10,000 Chat sessions/month', included: true },
        { text: 'Website integration', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'Knowledge base (250MB)', included: true },
        { text: 'Lead generation forms', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Team collaboration (10 users)', included: true },
        { text: 'Custom domain', included: true },
      ],
      ctaText: 'Get Started',
      highlighted: false,
    }
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your business needs. No hidden fees or complicated tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              ctaText={plan.ctaText}
              highlighted={plan.highlighted}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-3">Need a custom solution?</h3>
          <p className="text-muted-foreground mb-6">
            Contact our sales team for enterprise pricing and custom solutions.
          </p>
          <a 
            href="#contact" 
            className="text-primary font-medium hover:underline transition-all"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
