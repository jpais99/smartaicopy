// src/components/sections/auth/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/lib/auth/auth-context';

const REMEMBERED_EMAIL_KEY = 'smartaicopy_remembered_email';

export default function LoginForm() {
  const { login } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      // Just call login and let AuthContext handle navigation
      await login(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

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
              autoComplete="email"
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
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
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
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">
              Remember me on this browser
            </label>
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