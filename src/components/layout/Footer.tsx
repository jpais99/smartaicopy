// src/components/layout/Footer.tsx
// Footer component with links and social media
import Link from 'next/link';

export default function Footer() {
 return (
   <footer className="bg-white border-t">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
         <div>
           <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
           <ul className="mt-4 space-y-4">
             <li>
               <Link href="/features" className="text-gray-600 hover:text-gray-900">
                 Features
               </Link>
             </li>
             <li>
               <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                 Pricing
               </Link>
             </li>
           </ul>
         </div>
         <div>
           <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
           <ul className="mt-4 space-y-4">
             <li>
               <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                 Documentation
               </Link>
             </li>
             <li>
               <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                 Contact
               </Link>
             </li>
           </ul>
         </div>
         <div>
           <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
           <ul className="mt-4 space-y-4">
             <li>
               <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                 Privacy
               </Link>
             </li>
             <li>
               <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                 Terms
               </Link>
             </li>
           </ul>
         </div>
         <div>
           <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
           <ul className="mt-4 space-y-4">
             <li>
               <Link href="/about" className="text-gray-600 hover:text-gray-900">
                 About
               </Link>
             </li>
             <li>
               <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                 Blog
               </Link>
             </li>
           </ul>
         </div>
       </div>
       <div className="mt-8 border-t pt-8">
         <p className="text-gray-400 text-sm text-center">
           © {new Date().getFullYear()} SmartAICopy. All rights reserved.
         </p>
       </div>
     </div>
   </footer>
 );
}