// src/app/privacy/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - SmartAICopy',
  description: 'How SmartAICopy and Upper Left AI handle and protect your data',
};

export default function PrivacyPage() {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="privacy-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-secondary">
            Last updated: December 5, 2024
          </p>
        </div>

        <div className="prose max-w-none text-foreground">
          <div className="mb-12">
            <p className="text-lg">
              Hey there! This is where we explain how SmartAICopy (a creation of Upper Left AI) 
              handles your data. We know privacy policies are usually about as fun as watching paint dry, 
              but we'll try to keep this clear and maybe even slightly entertaining.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Collect</h2>
          <p>
            Here's what we gather when you use SmartAICopy (and why we need it):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account Info:</strong> Your email address (so you can log in) and a securely 
              hashed version of your password (we can't read it, and that's the point).
            </li>
            <li>
              <strong>Your Content:</strong> The text you submit for optimization. We need this to, 
              well, optimize it! We store your original and optimized content in your history if 
              you're logged in.
            </li>
            <li>
              <strong>Payment Details:</strong> When you pay for optimizations, Stripe (our payment 
              processor) handles all the sensitive stuff. We just keep track of what you've paid for.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use It</h2>
          <p>
            We're pretty straightforward folks. Here's what we do with your data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Optimize your content (that's why you're here!)
            </li>
            <li>
              Keep track of your optimization history (if you create an account)
            </li>
            <li>
              Process your payments (can't keep the lights on without this one)
            </li>
            <li>
              Make the service better (by understanding how people use it)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Protect It</h2>
          <p>
            We take security seriously (but not so seriously that we can't make a dad joke about it). 
            Your data is:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Encrypted in transit (like a secret message in a digital bottle)
            </li>
            <li>
              Stored securely in MongoDB Atlas (with more layers of security than a digital onion)
            </li>
            <li>
              Protected by strong authentication (no password sharing with your cat)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
          <p>
            If you create an account, we'll keep your optimization history until you decide to delete it 
            or close your account. For guests, we keep absolutely nothing - your content disappears 
            like a ninja in the night once you're done.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
          <p>
            We use some awesome tools to make SmartAICopy work:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>OpenAI:</strong> Powers our content optimization (they're the brains behind 
              the operation)
            </li>
            <li>
              <strong>Stripe:</strong> Handles payments (because they're way better at it than we 
              would be)
            </li>
            <li>
              <strong>MongoDB Atlas:</strong> Stores your data (like a really secure digital filing 
              cabinet)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p>
            You have some important rights when it comes to your data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Access your data (peek behind the curtain anytime)
            </li>
            <li>
              Delete your account and data (sad to see you go, but we respect it)
            </li>
            <li>
              Export your optimization history (take your homework with you)
            </li>
            <li>
              Update your information (people change, and so can your email)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            Questions about privacy? Concerns? Just want to say hi? We're all ears! Drop us a line 
            at smartaicopy@upperleftai.com.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Marketing Communications</h2>
          <p>
          By creating an account, you agree to receive:
          </p>
          <ul className="list-disc pl-6 space-y-2">
          <li>
            Product updates and announcements about SmartAICopy
          </li>
          <li>
            Information about other Upper Left AI services
          </li>
          <li>
            Occasional marketing communications
          </li>
          </ul>
          <p className="mt-4">
            You can manage your communication preferences through your account settings. We will never sell your email address or contact information to third parties.
          </p>

          <div className="mt-12 p-6 bg-background/50 rounded-lg">
            <p className="text-sm text-secondary">
              This privacy policy is a living document - we'll update it as needed to reflect changes 
              in our practices or services. We'll let you know about any significant changes via 
              email or a notice on our website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}