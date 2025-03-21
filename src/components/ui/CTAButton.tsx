
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const CTAButton = ({ 
  children, 
  className, 
  href, 
  variant = 'default',
  size = 'default',
  onClick,
  type = 'button',
  disabled = false
}: CTAButtonProps) => {
  const buttonClasses = cn(
    'font-medium tracking-wide transition-all duration-300',
    'hover:scale-[1.02] active:scale-[0.98]',
    className
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        <Button 
          variant={variant} 
          size={size} 
          className={buttonClasses}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </a>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={buttonClasses} 
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default CTAButton;
