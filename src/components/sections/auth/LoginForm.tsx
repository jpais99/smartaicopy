// src/components/sections/auth/LoginForm.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; // Add this import
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/lib/auth/auth-context';

const REMEMBERED_EMAIL_KEY = 'smartaicopy_remembered_email';

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams(); // Add this line
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add this line
  const [rememberMe, setRememberMe] = useState(false);

  // Add this useEffect
  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setSuccess('Your password has been successfully reset. Please log in with your new password.');
    }
  }, [searchParams]);

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
    setSuccess(''); // Add this line
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

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

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
        {/* Add success message display */}
        {success && (
          <div className="mx-4 p-4 bg-green-50 text-green-800 rounded-lg" role="alert">
            {success}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Rest of the form remains unchanged */}
          {/* ... existing form content ... */}
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