// src/components/sections/dashboard/DashboardContent.tsx
'use client';

import { useState, useEffect } from 'react';
import OptimizeForm from '@/components/sections/optimize/OptimizeForm';
import OptimizeResults from '@/components/sections/optimize/OptimizeResults';
import OptimizePreview from '@/components/sections/optimize/OptimizePreview';
import OptimizationHistory from '@/components/sections/dashboard/OptimizationHistory';
import PaymentModal from '@/components/sections/optimize/PaymentModal';
import { OptimizeResponse } from '@/lib/api/content/types';
import { useAuth } from '@/lib/auth/auth-context';
import { saveOptimizationState, clearOptimizationState } from '@/lib/utils/state-preservation';

export default function DashboardContent() {
 const { isLoggedIn } = useAuth();
 const [results, setResults] = useState<OptimizeResponse | null>(null);
 const [isPaid, setIsPaid] = useState(false);
 const [showPayment, setShowPayment] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (data: {
   content: string;
   wordCount: number;
   price: number;
 }) => {
   setIsLoading(true);
   try {
     const response = await fetch('/api/optimize', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });

     const result = await response.json();
     
     if (!response.ok) {
       throw new Error(result.error || 'Failed to optimize content');
     }

     setResults(result);
     // Save initial results with preview status
     saveOptimizationState(result, 'preview', false);
   } catch (error) {
     console.error('Optimization failed:', error);
     // Handle error display to user here
   } finally {
     setIsLoading(false);
   }
 };

 const handlePurchaseAttempt = () => {
   // No need for auth check in dashboard as user is already authenticated
   setShowPayment(true);
 };

 const handlePurchaseComplete = () => {
   setIsPaid(true);
   setShowPayment(false);
   if (results) {
     // Save as completed and paid
     saveOptimizationState(results, 'completed', true);
   }
 };

 const handleReset = () => {
   setResults(null);
   setIsPaid(false);
   setShowPayment(false);
   clearOptimizationState();
 };

 return (
   <div className="max-w-3xl mx-auto space-y-8">
     {/* Optimization Form or Results Section */}
     <div className="bg-background/50 rounded-lg p-6">
       <h2 className="text-xl font-medium mb-6">Optimize New Content</h2>
       {results ? (
         isPaid ? (
           <OptimizeResults results={results} onReset={handleReset} />
         ) : (
           <>
             <OptimizePreview 
               results={results} 
               onPurchase={handlePurchaseAttempt}
               isGuest={false}
             />
             {showPayment && (
               <PaymentModal
                 results={results}
                 onClose={() => setShowPayment(false)}
                 onPaymentComplete={handlePurchaseComplete}
                 isGuest={false}
               />
             )}
           </>
         )
       ) : (
         <OptimizeForm onSubmit={handleSubmit} isLoading={isLoading} />
       )}
     </div>

     {/* History Section */}
     {isLoggedIn && (
       <div className="bg-background/50 rounded-lg p-6">
         <h2 className="text-xl font-medium mb-6">Recent Optimizations</h2>
         <OptimizationHistory />
       </div>
     )}
   </div>
 );
}