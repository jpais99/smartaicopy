// src/components/common/Button.tsx
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  href,
  ...props
}: ButtonProps) {
  // Base styles that apply to all buttons
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';

  // Variant-specific styles
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
    secondary: 'bg-secondary text-white hover:bg-secondary/80 disabled:opacity-50',
    outline: 'border border-foreground/20 bg-background text-foreground hover:bg-accent/5 disabled:opacity-50'
  };

  // Size-specific styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${isLoading || disabled ? 'cursor-not-allowed' : ''}
    ${className}
    w-full text-center
  `.trim();

  // If href is provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={combinedStyles}
        {...(props as any)}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      className={combinedStyles}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}