// src/app/reset-password/[token]/page.tsx

import { Metadata } from 'next';
import { NextPage } from 'next';
import ResetPasswordForm from '@/components/sections/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Set New Password - SmartAICopy',
  description: 'Set a new password for your SmartAICopy account',
  robots: 'noindex, nofollow'
};

const ResetPasswordPage: NextPage<{ params: { token: string } }> = ({ params }) => {
  return (
    <section
      aria-labelledby="reset-password-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="reset-password-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground"
          >
            Set New Password
          </h1>
          <p className="mt-2 text-secondary">
            Enter your new password below
          </p>
        </div>

        <ResetPasswordForm token={params.token} />
      </div>
    </section>
  );
};

export default ResetPasswordPage;