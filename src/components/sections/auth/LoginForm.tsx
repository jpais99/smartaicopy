'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Temporary: Simulate auth attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // This will be replaced with actual auth logic
    setError('Authentication coming soon');
  };

  return (
    <Card variant="primary">
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                block w-full px-3 py-2
                bg-background
                border rounded-lg
                text-foreground placeholder-secondary
                focus:outline-none focus:ring-2 focus:ring-accent
                transition-colors
                ${error ? 'border-red-500' : 'border-foreground/20 hover:border-foreground/30'}
              `.trim()}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                block w-full px-3 py-2
                bg-background
                border rounded-lg
                text-foreground placeholder-secondary
                focus:outline-none focus:ring-2 focus:ring-accent
                transition-colors
                ${error ? 'border-red-500' : 'border-foreground/20 hover:border-foreground/30'}
              `.trim()}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm" role="alert">
            {error}
          </div>
        )}

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>

        <div className="text-center space-y-2 text-sm pt-2">
          <p className="text-secondary">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Create one
            </Link>
          </p>
          <p>
            <Link
              href="/forgot-password"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}