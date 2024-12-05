// src/components/layout/Header.tsx

'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/common/Button';
import { useAuth } from '@/lib/auth/auth-context';
import { clearOptimizationState } from '@/lib/utils/state-preservation';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleOptimizeClick = () => {
    clearOptimizationState();
    // If we're already on the optimize page, force a refresh
    if (pathname === '/optimize') {
      window.location.href = '/optimize';
    } else {
      router.push('/optimize');
    }
  };

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
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleOptimizeClick}
                >
                  Optimize Content
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}