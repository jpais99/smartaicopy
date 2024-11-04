// src/components/common/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'highlight';
}

export default function Card({ 
  title, 
  children, 
  footer, 
  className = '',
  variant = 'primary'
}: CardProps) {
  const variants = {
    primary: 'bg-background border border-foreground/20',
    secondary: 'bg-[rgb(247,193,62,0.25)] border border-foreground/20',
    highlight: 'bg-primary/20 border-2 border-accent shadow-lg'
  };

  return (
    <div 
      className={`rounded-lg ${variants[variant]} ${className}`}
    >
      {title && (
        <div className="px-6 pt-6">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
        </div>
      )}
      <div className="px-6 pb-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-foreground/20">
          {footer}
        </div>
      )}
    </div>
  );
}