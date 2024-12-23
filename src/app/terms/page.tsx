// src/app/terms/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - SmartAICopy',
  description: 'Terms and conditions for using SmartAICopy, an Upper Left AI service',
};

export default function TermsPage() {
  return (
    <section
      aria-labelledby="terms-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="terms-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-secondary">
            Last updated: December 5, 2024
          </p>
        </div>

        <div className="prose max-w-none text-foreground">
          <div className="mb-12">
            <p className="text-lg">
              These Terms of Service govern your use of SmartAICopy, a service provided by 
              Upper Left AI. By using SmartAICopy, you agree to these terms in their entirety.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Service Description</h2>
          <p>
            SmartAICopy provides AI-powered content optimization services. The service processes 
            your content to enhance readability, generate title suggestions, create meta descriptions, 
            and suggest relevant keywords. We offer two service tiers based on content length: up to 
            1,500 words for $10, and 1,501-3,000 words for $15.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
          <p>
            While you may use SmartAICopy without an account, creating an account allows you to 
            access your optimization history. You are responsible for maintaining the confidentiality 
            of your account credentials and for all activities conducted through your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Communications and Marketing</h2>
          <p>
          By creating an account, you consent to receive communications from Upper Left AI 
          regarding SmartAICopy and other services. While we will never sell your personal 
          information to third parties, we may:
          </p>
          <ul className="list-disc pl-6 space-y-2">
          <li>
            Send you product updates and announcements
          </li>
          <li>
            Inform you about new Upper Left AI services
          </li>
          <li>
            Share marketing communications about features and offers
          </li>
          </ul>
          <p className="mt-4">
            You can control these communications through your account settings. Certain 
            service-related communications, such as security updates or changes to these terms, 
            may not be opted out of.
        </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payment Terms</h2>
          <p>
            SmartAICopy operates on a per-use basis. Each optimization requires payment before 
            receiving full results. All payments are processed securely through Stripe. Prices are 
            in USD and may be subject to change with notice. All sales are final.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Content and Usage</h2>
          <p>
            You retain all rights to your original content. By using SmartAICopy, you grant us permission to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
          <li>
            Process and optimize your content for your use
          </li>
          <li>
            Display anonymized before/after examples of optimizations in our marketing materials, 
            website, and promotional content
          </li>
          <li>
            Analyze aggregated, anonymized usage patterns to improve our service
          </li>
          </ul>
          <p className="mt-4">
          We will never sell your original or optimized content to third parties or use it for purposes other than those specified above. All content examples used in marketing materials will be anonymized and stripped of any identifying information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Usage Restrictions</h2>
          <p>
            When using SmartAICopy, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Submit content that violates any laws or regulations
            </li>
            <li>
              Attempt to circumvent our word limits or payment system
            </li>
            <li>
              Use the service in any way that could damage or overburden our systems
            </li>
            <li>
              Share account access with others
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Service Limitations</h2>
          <p>
            SmartAICopy processes content up to 3,000 words per submission. While we strive for 
            high-quality results, we cannot guarantee specific outcomes from our optimization process. 
            The service may occasionally be unavailable for maintenance or updates.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
          <p>
            SmartAICopy and its original content, features, and functionality are owned by Upper 
            Left AI and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
          <p>
            SmartAICopy is provided "as is" without any warranties, expressed or implied. We do not 
            warrant that the service will be error-free or uninterrupted.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
          <p>
            Upper Left AI shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of or inability to use SmartAICopy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of 
            significant changes through our website or by email.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Information</h2>
          <p>
            For questions about these terms, please contact us at smartaicopy@upperleftai.com.
          </p>

          <div className="mt-12 p-6 bg-background/50 rounded-lg">
            <p className="text-sm text-secondary">
              By using SmartAICopy, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}