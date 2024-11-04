// src/components/sections/optimize/OptimizeForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface OptimizeFormProps {
  onSubmit?: (data: {
    content: string;
    wordCount: number;
    price: number;
  }) => Promise<void>;
}

export default function OptimizeForm({ onSubmit }: OptimizeFormProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [truncated, setTruncated] = useState(false);

  // Calculate word count and handle content truncation
  const processContent = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length > 3000) {
      const truncatedText = words.slice(0, 3000).join(' ');
      setContent(truncatedText);
      setTruncated(true);
      return truncatedText;
    }
    setTruncated(false);
    return text;
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const price = wordCount <= 1500 ? 25 : 50;

  // Form validation
  const isValid = content.trim().length > 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsLoading(true);
    setError('');

    try {
      if (onSubmit) {
        await onSubmit({
          content,
          wordCount,
          price
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="primary">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-lg font-medium text-foreground"
          >
            Your Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              const processed = processContent(e.target.value);
              setContent(processed);
            }}
            className={`
              w-full min-h-[200px] p-4
              bg-background
              border rounded-lg
              text-foreground placeholder-secondary
              transition-colors
              ${error ? 'border-red-500' : 'border-foreground/20 hover:border-foreground/30'}
            `.trim()}
            placeholder="Paste your content here (maximum 3000 words)..."
            aria-describedby="word-count"
          />
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span id="word-count" className="text-secondary">
                {wordCount} words {wordCount === 3000 && "(maximum)"}
              </span>
              <span className="text-secondary">
                Price: ${price}
              </span>
            </div>
            {truncated && (
              <p className="text-accent" role="alert">
                Content has been truncated to 3000 words.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        >
          Optimize Content
        </Button>
      </form>
    </Card>
  );
}