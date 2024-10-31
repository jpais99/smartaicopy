// src/components/common/Input.tsx
// Reusable input component with label, error state, and helper text
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
 helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
 ({ label, error, helperText, className = '', ...props }, ref) => {
   return (
     <div className="w-full">
       {label && (
         <label className="block text-sm font-medium text-gray-700 mb-1">
           {label}
         </label>
       )}
       <input
         ref={ref}
         className={`
           w-full px-3 py-2 border rounded-md shadow-sm
           focus:outline-none focus:ring-1
           ${error
             ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
             : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
           }
           ${className}
         `.trim()}
         {...props}
       />
       {error && (
         <p className="mt-1 text-sm text-red-600">{error}</p>
       )}
       {helperText && !error && (
         <p className="mt-1 text-sm text-gray-500">{helperText}</p>
       )}
     </div>
   );
 }
);

Input.displayName = 'Input';

export default Input;