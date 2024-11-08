// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import Button from '@/components/common/Button';
import { useAuth } from '@/lib/auth/auth-context';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

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
            className="flex items-center space-x-4" 
            role="navigation" 
            aria-label="Main navigation"
          >
            {isLoggedIn ? (
              <>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/optimize">
                  <Button variant="primary" size="sm">
                    Optimize Content
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}