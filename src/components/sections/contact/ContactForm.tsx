// src/components/sections/contact/ContactForm.tsx

'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

// This type defines the structure of our form data
interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  accountEmail?: string;
  transactionId?: string;
}

// These are our contact categories
const CONTACT_CATEGORIES = [
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'account', label: 'Account Help' },
  { value: 'general', label: 'General Inquiry' },
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    accountEmail: '',
    transactionId: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        accountEmail: '',
        transactionId: '',
      });
    } catch (err) {
      setError('Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Message Received</h2>
          <p className="text-secondary mb-6">
            Thank you for contacting us. We'll respond to your inquiry as soon as possible.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="secondary"
          >
            Send Another Message
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Reason for Contact
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Select a category</option>
            {CONTACT_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Field */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        {/* Optional Fields */}
        <div className="space-y-6 pt-4 border-t border-foreground/10">
          <p className="text-sm text-secondary">Optional Information</p>
          
          {/* Account Email Field */}
          <div>
            <label
              htmlFor="accountEmail"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Account Email (if different from above)
            </label>
            <input
              id="accountEmail"
              name="accountEmail"
              type="email"
              value={formData.accountEmail}
              onChange={handleChange}
              className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Transaction ID Field */}
          <div>
            <label
              htmlFor="transactionId"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Order/Transaction ID (if applicable)
            </label>
            <input
              id="transactionId"
              name="transactionId"
              type="text"
              value={formData.transactionId}
              onChange={handleChange}
              className="block w-full px-3 py-2 rounded-lg border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Send Message
        </Button>
      </form>
    </Card>
  );
}