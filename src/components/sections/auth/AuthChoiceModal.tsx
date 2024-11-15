// src/components/sections/auth/AuthChoiceModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { OptimizeResponse } from '@/lib/api/content/types';
import { saveOptimizationState, setReturnPath } from '@/lib/utils/state-preservation';

interface AuthChoiceModalProps {
 onClose: () => void;
 onProceedAsGuest: () => void;
 results: OptimizeResponse;
}

export default function AuthChoiceModal({ 
 onClose, 
 onProceedAsGuest,
 results 
}: AuthChoiceModalProps) {
 const router = useRouter();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
   setMounted(true);
 }, []);

 const handleAuth = (path: string) => {
  // Log the state before saving
  console.log('AuthChoiceModal - Starting auth redirect');
  
  // Save results with explicit payment pending flag
  const state = {
    results,
    status: 'preview',
    isPaid: false,
    paymentPending: true
  };
  console.log('AuthChoiceModal - Saving state:', state);
  saveOptimizationState(results, 'preview', false, true);
  
  // Set return path with payment and auth flags
  const searchParams = new URLSearchParams({
    restore: 'true',
    showPayment: 'true',
    fromAuth: 'true'
  });
  const returnPath = `/optimize?${searchParams.toString()}`;
  console.log('AuthChoiceModal - Setting return path:', returnPath);
  setReturnPath(returnPath);
  
  console.log('AuthChoiceModal - Redirecting to:', path);
  router.push(path);
};

 const handleGuestContinue = () => {
   // Clear any stored state since we're proceeding as guest
   localStorage.removeItem('pendingOptimization');
   localStorage.removeItem('authReturnPath');
   
   onProceedAsGuest();
 };

 if (!mounted) return null;

 return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
     <Card variant="primary" className="w-full max-w-md">
       <div className="space-y-6 p-4">
         <div className="text-center">
           <h3 className="text-lg font-medium">Create Your Account</h3>
           <p className="mt-2 text-secondary">
             Save your optimizations and streamline future payments
           </p>
         </div>

         <div className="space-y-4">
           <div className="border-b border-foreground/10 pb-4">
             <h4 className="text-sm font-medium mb-2">Account Benefits:</h4>
             <ul className="space-y-2 text-sm text-secondary">
               <li>• Save optimization history</li>
               <li>• Access results anytime</li>
               <li>• Save payment information</li>
               <li>• Track content improvements</li>
             </ul>
           </div>

           <div className="space-y-3">
             <Button
               onClick={() => handleAuth('/signup')}
               className="w-full"
             >
               Create Account
             </Button>
             
             <Button
               onClick={() => handleAuth('/login')}
               variant="secondary"
               className="w-full"
             >
               Sign In
             </Button>

             <Button
               onClick={handleGuestContinue}
               variant="outline"
               className="w-full"
             >
               Continue as Guest
             </Button>
           </div>
         </div>

         <p className="text-xs text-center text-secondary">
           You won't be able to access these results later if you continue as a guest
         </p>
       </div>
     </Card>
   </div>
 );
}