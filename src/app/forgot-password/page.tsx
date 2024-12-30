// src/app/forgot-password/page.tsx

import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/sections/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - SmartAICopy',
  description: 'Reset your SmartAICopy account password',
};

export default function ForgotPasswordPage() {
  return (
    <section
      aria-labelledby="forgot-password-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="forgot-password-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground"
          >
            Reset Your Password
          </h1>
          <p className="mt-2 text-secondary">
            Enter your email to reset your password
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </section>
  );
}