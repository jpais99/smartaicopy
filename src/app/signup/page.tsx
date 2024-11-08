// src/app/signup/page.tsx
import { Metadata } from 'next';
import SignupForm from '@/components/sections/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account - SmartAICopy',
  description: 'Create your SmartAICopy account to save your optimization history and payment information.',
};

export default function SignupPage() {
  return (
    <section
      aria-labelledby="signup-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="signup-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground"
          >
            Create Your Account
          </h1>
          <p className="mt-2 text-secondary">
            Join SmartAICopy to save your optimization history
          </p>
        </div>

        <SignupForm />
      </div>
    </section>
  );
}