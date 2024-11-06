// src/components/sections/optimize/OptimizePreview.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PaymentModal from './PaymentModal';
import { OptimizeResponse } from '@/lib/api/content/types';

interface OptimizePreviewProps {
  results: OptimizeResponse;
  onPurchase: () => void;
}

export default function OptimizePreview({ results, onPurchase }: OptimizePreviewProps) {
  const [showPayment, setShowPayment] = useState(false);

  // Get first two sentences for preview, excluding any markdown-style formatting
  const getPreviewContent = (content: string) => {
    const cleanContent = content
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '')   // Remove any remaining asterisks
      .replace(/^\s*#+ /gm, '') // Remove heading markers
      .trim();
    
    const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(' ');
  };

  const previewContent = getPreviewContent(results.optimizedContent);
  const price = results.wordCount <= 1500 ? 25 : 50;

  return (
    <>
      <div className="space-y-6">
        <Card variant="primary">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Preview of Your Optimized Content</h3>
              <div className="relative">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-foreground leading-relaxed">
                    {previewContent}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-background/50 rounded-lg">
              <h4 className="font-medium">Your full results will include:</h4>
              <ul className="space-y-2 list-disc pl-5">
                <li>Complete optimized content</li>
                <li>3 engaging title suggestions</li>
                <li>SEO-optimized meta description</li>
                <li>5 relevant keywords for better visibility</li>
              </ul>

              <div className="pt-4">
                <Button onClick={() => setShowPayment(true)} className="w-full">
                  Purchase Full Results (${price})
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showPayment && (
        <PaymentModal
          amount={price}
          wordCount={results.wordCount}
          onClose={() => setShowPayment(false)}
          onPaymentComplete={() => {
            setShowPayment(false);
            onPurchase();
          }}
        />
      )}
    </>
  );
}