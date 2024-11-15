// src/components/sections/optimize/PaymentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { OptimizeResponse } from '@/lib/api/content/types';
import { useAuth } from '@/lib/auth/auth-context';

interface PaymentModalProps {
 results: OptimizeResponse;
 onClose: () => void;
 onPaymentComplete: () => void;
 isGuest?: boolean;
}

export default function PaymentModal({ 
 results, 
 onClose, 
 onPaymentComplete,
 isGuest = false
}: PaymentModalProps) {
 const { isLoggedIn } = useAuth();
 const [isProcessing, setIsProcessing] = useState(false);
 const [error, setError] = useState('');
 const [savePaymentMethod, setSavePaymentMethod] = useState(false);
 const [savedMethods, setSavedMethods] = useState<any[]>([]);
 const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

 // Calculate price based on word count
 const price = results.wordCount <= 1500 ? 25 : 50;

 // Get first sentence of optimized content for preview
 const previewText = results.optimizedContent
   .split(/[.!?]/)
   .filter(sentence => sentence.trim())[0]
   .trim() + '...';

 // Fetch saved payment methods for logged-in users
 useEffect(() => {
   if (isLoggedIn && !isGuest) {
     // This will be replaced with actual Stripe API call
     // For now, just simulating saved methods
     setSavedMethods([]);
   }
 }, [isLoggedIn, isGuest]);

 const handleDemoPayment = async () => {
   setIsProcessing(true);
   setError('');
   
   try {
     // Simulate payment processing
     await new Promise(resolve => setTimeout(resolve, 1500));
     
     // In the future, this will be replaced with actual Stripe payment processing
     // Will also handle saving payment method if selected
     if (savePaymentMethod) {
       // Will save payment method to Stripe
       console.log('Payment method would be saved');
     }
     
     onPaymentComplete();
   } catch (err) {
     setError('Payment processing failed. Please try again.');
   } finally {
     setIsProcessing(false);
   }
 };

 return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
     <Card variant="primary" className="w-full max-w-md">
       <div className="space-y-6 p-4">
         <div className="text-center">
           <h3 className="text-lg font-medium">Complete Your Purchase</h3>
           <p className="mt-2 text-secondary">
             {results.wordCount.toLocaleString()} words optimization
           </p>
         </div>

         <div className="space-y-4">
           <div className="p-3 bg-background/50 rounded-lg text-sm">
             <h4 className="font-medium mb-2">Preview of optimized content:</h4>
             <p className="text-secondary italic">{previewText}</p>
           </div>

           {isLoggedIn && !isGuest && savedMethods.length > 0 && (
             <div className="space-y-2">
               <h4 className="text-sm font-medium">Saved Payment Methods</h4>
               <div className="space-y-2">
                 {savedMethods.map((method) => (
                   <button
                     key={method.id}
                     onClick={() => setSelectedMethod(method.id)}
                     className={`w-full p-3 rounded-lg border text-left ${
                       selectedMethod === method.id
                         ? 'border-primary bg-primary/10'
                         : 'border-foreground/20'
                     }`}
                   >
                     {/* This will show card info from Stripe */}
                     {method.card.brand} •••• {method.card.last4}
                   </button>
                 ))}
               </div>
             </div>
           )}

           <div className="border-t border-b border-foreground/10 py-4">
             <div className="flex justify-between items-center">
               <span>Amount:</span>
               <span className="text-lg font-medium">${price}</span>
             </div>
           </div>

           <div className="text-sm space-y-2">
             <h4 className="font-medium">What you'll get:</h4>
             <ul className="list-disc list-inside text-secondary space-y-1">
               <li>Full optimized content</li>
               <li>{results.suggestions.title.length} SEO-optimized title suggestions</li>
               <li>Meta description for better search visibility</li>
               <li>{results.suggestions.keywords.length} relevant keywords</li>
             </ul>
           </div>

           {error && (
             <div className="text-red-500 text-center" role="alert">
               {error}
             </div>
           )}

           {/* Only show save payment option for logged-in users not in guest mode */}
           {isLoggedIn && !isGuest && !selectedMethod && (
             <div className="flex items-center space-x-2">
               <input
                 type="checkbox"
                 id="savePayment"
                 checked={savePaymentMethod}
                 onChange={(e) => setSavePaymentMethod(e.target.checked)}
                 className="rounded border-foreground/20"
               />
               <label htmlFor="savePayment" className="text-sm text-secondary">
                 Save payment method for future purchases
               </label>
             </div>
           )}

           <div className="space-y-3">
             <Button
               onClick={handleDemoPayment}
               disabled={isProcessing}
               isLoading={isProcessing}
               className="w-full"
             >
               {isProcessing ? 'Processing...' : `Pay $${price}`}
             </Button>
             
             <Button
               onClick={onClose}
               variant="secondary"
               disabled={isProcessing}
               className="w-full"
             >
               Cancel
             </Button>
           </div>

           <p className="text-xs text-center text-secondary">
             {isGuest ? (
               'One-time secure payment'
             ) : (
               'Secure payment processing powered by Stripe (coming soon)'
             )}
           </p>
         </div>
       </div>
     </Card>
   </div>
 );
}