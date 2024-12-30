// src/app/login/page.tsx

import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/sections/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - SmartAICopy',
  description: 'Sign in to your SmartAICopy account',
};

export default function LoginPage() {
  return (
    <section
      aria-labelledby="login-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="login-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground"
          >
            Welcome Back
          </h1>
          <p className="mt-2 text-secondary">
            Sign in to your account to manage your optimizations
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}