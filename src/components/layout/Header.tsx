// src/components/layout/Header.tsx
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function Header() {
  return (
    <header 
      className="w-full bg-background border-b border-foreground/10 sticky top-0 z-50"
      role="banner"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="SmartAICopy home"
            >
              SmartAICopy
            </Link>
          </div>
          <nav 
            className="flex items-center space-x-8" 
            role="navigation" 
            aria-label="Main navigation"
          >
            <Link 
              href="/pricing" 
              className="text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Pricing
            </Link>
            <Button 
              href="/optimize" 
              variant="primary"
              size="sm"
              aria-label="Start optimizing your content"
            >
              Optimize Content
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}