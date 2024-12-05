// src/components/sections/optimize/OptimizePreview.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { OptimizeResponse } from '@/lib/api/content/types';

interface OptimizePreviewProps {
  results: OptimizeResponse;
  onPurchase: () => void;
  isGuest?: boolean;
}

export default function OptimizePreview({ 
  results, 
  onPurchase,
  isGuest = false
}: OptimizePreviewProps) {
  const getPreviewContent = (content: string) => {
    const cleanContent = content
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^\s*#+ /gm, '')
      .trim();
    
    const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(' ');
  };

  const previewContent = getPreviewContent(results.optimizedContent);
  const price = results.wordCount <= 1500 ? 25 : 50;

  return (
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
              <div className="flex justify-between items-center mb-3 text-sm text-secondary">
                <span>Based on submitted content:</span>
                <span>{results.wordCount.toLocaleString()} words</span>
              </div>
              <Button onClick={onPurchase} className="w-full">
                Purchase Full Results (${price})
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}