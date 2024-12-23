// src/app/pricing/page.tsx

import { Metadata } from 'next';
import Card from '@/components/common/Card';

export const metadata: Metadata = {
  title: 'Pricing Details - SmartAICopy',
  description: 'Detailed information about SmartAICopy pricing, billing, and features',
};

export default function PricingPage() {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            Pricing Details
          </h1>
          <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
            Simple, transparent pricing with no subscriptions or commitments.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card variant="secondary">
            <div className="px-6 pt-6">
              <h2 className="text-2xl font-bold">Standard</h2>
              <p className="mt-2 text-secondary">For shorter content</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$10</span>
                <span className="text-secondary">/piece</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">Up to 1,500 words</span>
                </li>
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">3 title suggestions</span>
                </li>
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">SEO meta description</span>
                </li>
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">5 keyword suggestions</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card variant="secondary">
            <div className="px-6 pt-6">
              <h2 className="text-2xl font-bold">Extended</h2>
              <p className="mt-2 text-secondary">For longer content</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$15</span>
                <span className="text-secondary">/piece</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">1,501 - 3,000 words</span>
                </li>
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">3 title suggestions</span>
                </li>
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">SEO meta description</span>
                </li>
                <li className="flex items-center text-secondary">
                  <span className="text-accent font-bold">✓</span>
                  <span className="ml-3">5 keyword suggestions</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        {/* What's Included */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Content Optimization</h3>
              <ul className="space-y-2 text-secondary">
                <li>Enhanced readability and engagement</li>
                <li>Improved sentence structure and flow</li>
                <li>Grammar and style improvements</li>
                <li>SEO-optimized phrasing</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">SEO Enhancements</h3>
              <ul className="space-y-2 text-secondary">
                <li>Three unique title variations</li>
                <li>Meta description (optimal 150-160 characters)</li>
                <li>Five relevant keyword suggestions</li>
                <li>Search-friendly content structure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
          <div className="space-y-6 text-secondary">
            <p>
              All prices are in USD. Payments are processed securely through Stripe, and we accept 
              all major credit cards. Each optimization is a one-time purchase - there are no 
              subscriptions or recurring charges.
            </p>
            <p>
              Word count is calculated based on your submitted content, with hyphenated words 
              counted as single words. The appropriate price tier is automatically determined 
              based on your content length.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What happens if my content is right at the word limit?</h3>
              <p className="text-secondary">
                For content exactly at 1,500 words, you'll be charged the Standard tier price of $10. 
                Our word counter provides a real-time count as you input your content, helping you 
                make informed decisions about content length.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-secondary">
                Due to the immediate delivery of optimized content, we generally do not offer refunds. 
                However, if you experience technical issues that prevent delivery of your optimized 
                content, please contact us immediately.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Are there any hidden fees?</h3>
              <p className="text-secondary">
                No. The price you see is the price you pay. There are no additional processing fees, 
                service charges, or hidden costs. Sales tax may apply depending on your location.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-secondary">
                We accept all major credit and debit cards through our secure payment processor, 
                Stripe. This includes Visa, Mastercard, American Express, and Discover.
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-background/50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Have more questions?</h2>
          <p className="text-secondary">
            Contact us at smartaicopy@upperleftai.com for any pricing-related questions 
            not covered here.
          </p>
        </div>
      </div>
    </section>
  );
}