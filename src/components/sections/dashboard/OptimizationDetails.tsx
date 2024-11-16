// src/components/sections/dashboard/OptimizationDetails.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { OptimizationResult } from '@/lib/api/content/types';
import { Copy, Check } from 'lucide-react';

interface OptimizationDetailsProps {
  optimization: OptimizationResult;
  onClose: () => void;
}

export default function OptimizationDetails({ 
  optimization, 
  onClose 
}: OptimizationDetailsProps) {
  const [activeTab, setActiveTab] = useState<'optimized' | 'original'>('optimized');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Card className="relative">
      <div className="sticky top-0 bg-background border-b border-foreground/10 p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-secondary">
              {new Date(optimization.metadata.timestamp).toLocaleDateString()} at{' '}
              {new Date(optimization.metadata.timestamp).toLocaleTimeString()}
            </p>
            <h3 className="text-xl font-medium mt-1">
              {optimization.metadata.titles?.[0] || 'Optimized Content'}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="!w-auto"
            aria-label="Close details view"
          >
            Close
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'optimized' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('optimized')}
            className="!w-auto"
          >
            Optimized
          </Button>
          <Button
            variant={activeTab === 'original' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('original')}
            className="!w-auto"
          >
            Original
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Content Display */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(
              activeTab === 'optimized' ? optimization.optimizedContent : optimization.originalContent,
              `${activeTab}-content`
            )}
            className="absolute right-4 top-4 !w-auto"
            aria-label={`Copy ${activeTab} content`}
          >
            {copiedField === `${activeTab}-content` ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <div className="prose max-w-none p-4 bg-background/50 rounded-lg">
            {(activeTab === 'optimized' ? optimization.optimizedContent : optimization.originalContent)
              .split(/\n+/)
              .map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-4' : ''}>
                  {paragraph}
                </p>
              ))}
          </div>
        </div>

        {/* Metadata Section */}
        {activeTab === 'optimized' && (
          <div className="space-y-4">
            {/* Title Suggestions */}
            {optimization.metadata.titles && optimization.metadata.titles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Title Suggestions</h4>
                <div className="space-y-2">
                  {optimization.metadata.titles.map((title, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded-lg">
                      <span className="text-sm">{title}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(title, `title-${index}`)}
                        className="!w-auto"
                        aria-label={`Copy title suggestion ${index + 1}`}
                      >
                        {copiedField === `title-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {optimization.metadata.keywords && optimization.metadata.keywords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {optimization.metadata.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Description */}
            {optimization.metadata.metaDescription && (
              <div>
                <h4 className="text-sm font-medium mb-2">Meta Description</h4>
                <div className="relative">
                  <div className="p-2 bg-background/50 rounded-lg text-sm">
                    {optimization.metadata.metaDescription}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(optimization.metadata.metaDescription!, 'meta')}
                    className="absolute right-2 top-2 !w-auto"
                    aria-label="Copy meta description"
                  >
                    {copiedField === 'meta' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}