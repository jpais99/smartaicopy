// src/components/sections/home/Pricing.tsx

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function Pricing() {
 return (
   <section
     aria-labelledby="pricing-heading"
     className="container-padding section-padding"
   >
     <div className="max-w-7xl mx-auto">
       <div className="text-center mb-16">
         <h2 
           id="pricing-heading"
           className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
         >
           Simple Per-Piece Pricing
         </h2>
         <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
           Pay only for what you need. No subscriptions, no commitments.
         </p>
       </div>

       <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
         {/* Standard Tier */}
         <Card variant="secondary" className="flex flex-col">
           <div className="flex flex-col flex-grow">
             <div className="px-6 pt-6">
               <h3 className="text-2xl font-bold text-foreground">Standard</h3>
               <p className="mt-2 text-secondary">For shorter content</p>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-foreground">$10</span>
                 <span className="text-secondary">/piece</span>
               </div>
               <ul className="mt-6 space-y-4">
                 <li className="flex items-center text-secondary">
                   <span className="text-accent font-bold">✓</span>
                   <span className="ml-3">Up to 1,500 words</span>
                 </li>
                 <li className="flex items-center text-secondary">
                   <span className="text-accent font-bold">✓</span>
                   <span className="ml-3">Instant optimization</span>
                 </li>
                 <li className="flex items-center text-secondary">
                   <span className="text-accent font-bold">✓</span>
                   <span className="ml-3">SEO improvements</span>
                 </li>
               </ul>
             </div>
           </div>
           <div className="p-6">
             <Button 
               href="/optimize"
               variant="primary"
             >
               Optimize Content
             </Button>
           </div>
         </Card>

         {/* Extended Tier */}
         <Card variant="secondary" className="flex flex-col">
           <div className="flex flex-col flex-grow">
             <div className="px-6 pt-6">
               <h3 className="text-2xl font-bold text-foreground">Extended</h3>
               <p className="mt-2 text-secondary">For longer content</p>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-foreground">$15</span>
                 <span className="text-secondary">/piece</span>
               </div>
               <ul className="mt-6 space-y-4">
                 <li className="flex items-center text-secondary">
                   <span className="text-accent font-bold">✓</span>
                   <span className="ml-3">1,501 - 3,000 words</span>
                 </li>
                 <li className="flex items-center text-secondary">
                   <span className="text-accent font-bold">✓</span>
                   <span className="ml-3">Instant optimization</span>
                 </li>
                 <li className="flex items-center text-secondary">
                   <span className="text-accent font-bold">✓</span>
                   <span className="ml-3">SEO improvements</span>
                 </li>
               </ul>
             </div>
           </div>
           <div className="p-6">
             <Button 
               href="/optimize"
               variant="primary"
             >
               Optimize Content
             </Button>
           </div>
         </Card>
       </div>
     </div>
   </section>
 );
}