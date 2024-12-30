// src/app/login/page.tsx
import { Metadata } from 'next';
import LoginForm from '@/components/sections/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - SmartAICopy',
  description: 'Login to access your SmartAICopy dashboard and optimization history.',
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
            Sign in to access your dashboard and optimization history
          </p>
        </div>

        <LoginForm />
      </div>
    </section>
  );
}