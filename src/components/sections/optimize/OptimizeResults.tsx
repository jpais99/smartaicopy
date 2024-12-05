// src/components/sections/optimize/OptimizeResults.tsx

'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CopyButton from '@/components/common/CopyButton';
import { OptimizeResponse } from '@/lib/api/content/types';

interface OptimizeResultsProps {
  results: OptimizeResponse;
  onReset: () => void;
}

export default function OptimizeResults({ results, onReset }: OptimizeResultsProps) {
  const [activeTab, setActiveTab] = useState<'optimized' | 'original'>('optimized');

  return (
    <Card className="relative">
      <div className="sticky top-0 bg-background border-b border-foreground/10 p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-medium">
              {results.suggestions.title[0] || 'Optimized Content'}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="!w-auto"
          >
            New Optimization
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
          <CopyButton
            text={activeTab === 'optimized' ? results.optimizedContent : results.originalContent}
            className="absolute right-2 top-4"
          />
          <div className="prose max-w-none p-4 pr-14 bg-background/50 rounded-lg">
            {(activeTab === 'optimized' ? results.optimizedContent : results.originalContent)
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
            {results.suggestions.title.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Title Suggestions</h4>
                <div className="space-y-2">
                  {results.suggestions.title.map((title, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded-lg">
                      <span className="text-sm">{title}</span>
                      <CopyButton text={title} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
          {results.suggestions.keywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Keywords</h4>
              <div className="relative">
                <CopyButton 
                  text={results.suggestions.keywords.join(', ')} 
                  className="absolute right-2 top-2"
                />
                <div className="p-2 pr-14 bg-background/50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {results.suggestions.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Meta Description */}
            {results.suggestions.metaDescription && (
              <div>
                <h4 className="text-sm font-medium mb-2">Meta Description</h4>
                <div className="relative">
                  <div className="p-2 pr-14 bg-background/50 rounded-lg text-sm">
                    {results.suggestions.metaDescription}
                  </div>
                  <CopyButton
                    text={results.suggestions.metaDescription}
                    className="absolute right-2 top-2"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}