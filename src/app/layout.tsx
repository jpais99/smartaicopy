// src/app/layout.tsx
// Root layout component that wraps all pages
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the site
export const metadata = {
 title: 'SmartAICopy - AI Content Optimization',
 description: 'Professional content optimization powered by artificial intelligence',
}

// RootLayout props type
interface RootLayoutProps {
 children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
 return (
   <html lang="en">
     <body className={`${inter.className} min-h-screen flex flex-col`}>
       <Header />
       <main className="flex-grow">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {children}
         </div>
       </main>
       <Footer />
     </body>
   </html>
 )
}