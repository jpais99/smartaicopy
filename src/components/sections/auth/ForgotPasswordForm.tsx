// src/components/sections/auth/ForgotPasswordForm.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function ForgotPasswordForm() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (success) {
    return (
      <Card variant="primary">
        <div className="p-6 text-center space-y-4">
          <h2 className="text-lg font-medium text-foreground">Check Your Email</h2>
          <p className="text-secondary">
            If an account exists for {email}, we've sent password reset instructions to that email address.
          </p>
          <Link
            href="/login"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            Return to login
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="primary">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
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

        {error && (
          <div className="text-red-500 text-sm" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {isLoading ? 'Processing...' : 'Reset Password'}
        </Button>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </Card>
  );
}