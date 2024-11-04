// src/app/page.tsx
import Hero from '@/components/sections/home/Hero';
import Features from '@/components/sections/home/Features';
import Pricing from '@/components/sections/home/Pricing';

export default function Home() {
 return (
   <div className="min-h-screen">
     <main id="main" tabIndex={-1}>
       <Hero />
       <Features />
       <Pricing />
     </main>
   </div>
 );
}