// src/app/contact/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support - SmartAICopy',
  description: 'Get help and support for SmartAICopy, an Upper Left AI service',
};

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="contact-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            Contact Support
          </h1>
          <p className="mt-4 text-lg text-secondary">
            We're here to help with any questions or concerns about SmartAICopy.
          </p>
        </div>

        <div className="prose max-w-none">
          <p>
            For support, questions, or feedback, please email us at{' '}
            <a href="mailto:smartaicopy@upperleftai.com" className="text-accent hover:text-accent/80">
              smartaicopy@upperleftai.com
            </a>
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">For Technical Support</h2>
              <p className="text-secondary">
                Please include the following details in your email:
              </p>
              <ul className="text-secondary mt-2">
                <li>A clear description of what you were trying to do</li>
                <li>What happened versus what you expected to happen</li>
                <li>Your account email (if you have an account)</li>
                <li>Screenshots of any error messages or issues (if applicable)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold">For Billing Questions</h2>
              <p className="text-secondary">
                To help us assist you quickly, please provide:
              </p>
              <ul className="text-secondary mt-2">
                <li>Your account email</li>
                <li>The date of the transaction in question</li>
                <li>Any relevant transaction IDs</li>
                <li>A detailed description of your billing concern</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold">For Feature Requests</h2>
              <p className="text-secondary">
                We value your input on how to make SmartAICopy better. When suggesting features, 
                please describe:
              </p>
              <ul className="text-secondary mt-2">
                <li>The specific feature you'd like to see</li>
                <li>How you envision using this feature</li>
                <li>How it would improve your workflow</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold">For Account Help</h2>
              <p className="text-secondary">
                For account-related assistance, include:
              </p>
              <ul className="text-secondary mt-2">
                <li>Your account email address</li>
                <li>A description of the account issue you're experiencing</li>
                <li>Any error messages you've encountered</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-6 bg-background/50 rounded-lg">
            <p className="text-sm text-secondary">
              We aim to respond to all inquiries within one business day. For faster 
              assistance with technical issues, please provide as much detail as possible 
              in your initial email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}