
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import CTAButton from './CTAButton';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  highlighted?: boolean;
  ctaText: string;
  ctaAction?: () => void;
  className?: string;
}

const PricingCard = ({
  name,
  description,
  price,
  period,
  features,
  highlighted = false,
  ctaText,
  ctaAction,
  className
}: PricingCardProps) => {
  return (
    <div className={cn(
      'relative rounded-2xl p-8 transition-all duration-500',
      'border flex flex-col h-full',
      highlighted ? 
        'bg-primary/5 border-primary/20 shadow-lg' : 
        'bg-card border-border',
      className
    )}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2">/{period}</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className={cn(
              "rounded-full p-1 mr-3 mt-0.5",
              feature.included ? "text-primary bg-primary/10" : "text-muted-foreground/50 bg-muted"
            )}>
              <Check size={12} />
            </div>
            <span className={feature.included ? "text-foreground" : "text-muted-foreground line-through"}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
      
      <CTAButton 
        variant={highlighted ? "default" : "outline"} 
        className="w-full justify-center"
        onClick={ctaAction}
      >
        {ctaText}
      </CTAButton>
    </div>
  );
};

export default PricingCard;
