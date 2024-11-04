// src/components/sections/home/Hero.tsx
import Link from 'next/link';

export default function Hero() {
 return (
   <section 
     aria-labelledby="hero-heading" 
     className="container-padding section-padding"
   >
     <div className="max-w-7xl mx-auto">
       <div className="text-center">
         <h1 
           id="hero-heading"
           className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground"
         >
           Transform Your Content 
           <span className="text-accent"> with AI</span>
         </h1>
         <p className="mt-6 text-lg leading-8 text-secondary max-w-2xl mx-auto">
           Professional-grade content optimization powered by artificial intelligence.
           Enhance your writing while maintaining your unique voice.
         </p>
         <div 
           className="mt-10 flex items-center justify-center gap-x-6"
           role="group"
           aria-label="Primary actions"
         >
           <Link
             href="/dashboard"
             className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
           >
             Get Started
           </Link>
           <Link
             href="#features"
             className="text-sm font-semibold text-foreground hover:text-accent transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
             aria-label="Learn more about our features"
           >
             Learn more{' '}
             <span 
               aria-hidden="true"
               className="inline-block transition-transform group-hover:translate-x-1"
             >
               →
             </span>
           </Link>
         </div>
       </div>
     </div>
   </section>
 );
}