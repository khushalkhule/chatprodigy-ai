
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const FeatureCard = ({ title, description, icon: Icon, className }: FeatureCardProps) => {
  return (
    <div className={cn(
      'group relative rounded-2xl p-6 bg-white border border-border',
      'shadow-sm transition-all duration-300 hover:shadow-md',
      'flex flex-col items-start gap-4',
      className
    )}>
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
