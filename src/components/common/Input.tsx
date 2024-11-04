// src/components/common/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    // Generate an ID if none provided for accessibility
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : 
            undefined
          }
          className={`
            w-full px-4 py-2 
            bg-background
            border rounded-lg
            text-foreground placeholder:text-foreground/50
            transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
            ${error
              ? 'border-red-500/50 focus-visible:ring-red-500'
              : 'border-foreground/20 hover:border-foreground/30'
            }
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-foreground/70"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;