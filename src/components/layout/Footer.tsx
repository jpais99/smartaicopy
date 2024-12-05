// src/components/layout/Footer.tsx

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="w-full bg-background border-t border-foreground/10"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto container-padding py-12">
        <nav 
          className="max-w-2xl mx-auto"
          role="navigation"
          aria-label="Footer navigation"
        >
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            <div className="text-center">
              <h2 className="text-sm font-semibold text-foreground">Product</h2>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <Link 
                    href="/pricing" 
                    className="text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label="View our pricing plans"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <h2 className="text-sm font-semibold text-foreground">Legal</h2>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label="Read our privacy policy"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label="Read our terms of service"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <h2 className="text-sm font-semibold text-foreground">Support</h2>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <Link 
                    href="/contact" 
                    className="text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label="Contact our support team"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <div className="mt-8 pt-8 border-t border-foreground/10 text-center">
          <p 
            className="text-sm text-secondary"
            aria-label={`Copyright ${currentYear} SmartAICopy`}
          >
            © {currentYear} SmartAICopy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}