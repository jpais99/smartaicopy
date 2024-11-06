// src/components/sections/optimize/OptimizeResults.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { OptimizeResponse } from '@/lib/api/content/types';

interface OptimizeResultsProps {
  results: OptimizeResponse;
  onReset: () => void;
}

export default function OptimizeResults({ results, onReset }: OptimizeResultsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Clean the content for display and copying
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '')   // Remove any remaining asterisks
      .replace(/^\s*#+ /gm, '') // Remove heading markers
      .trim();
  };

  // Add proper paragraph spacing when copying
  const copyToClipboard = async (text: string, field: string) => {
    try {
      // For content field, add double line breaks between paragraphs
      const textToCopy = field === 'content' 
        ? formatContent(text)
            .split(/\n+/)
            .filter(para => para.trim())
            .join('\n\n')
        : formatContent(text);
      
      await navigator.clipboard.writeText(textToCopy);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formattedContent = formatContent(results.optimizedContent);

  return (
    <div className="space-y-6">
      <Card variant="primary">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Optimized Content</h3>
              <Button
                onClick={() => copyToClipboard(results.optimizedContent, 'content')}
                variant="secondary"
              >
                {copiedField === 'content' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              {formattedContent.split(/\n+/).filter(para => para.trim()).map((paragraph, index) => (
                <p 
                  key={index} 
                  className={`text-foreground leading-relaxed ${
                    index !== 0 ? 'mt-6' : ''
                  }`}
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Title Suggestions</h3>
            <div className="space-y-2">
              {results.suggestions.title.map((title, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded-lg">
                  <span>{formatContent(title)}</span>
                  <Button
                    onClick={() => copyToClipboard(title, `title-${index}`)}
                    variant="secondary"
                    size="sm"
                  >
                    {copiedField === `title-${index}` ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Meta Description</h3>
              <Button
                onClick={() => copyToClipboard(results.suggestions.metaDescription, 'meta')}
                variant="secondary"
              >
                {copiedField === 'meta' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              {formatContent(results.suggestions.metaDescription)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {results.suggestions.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-background/50 rounded-full text-sm"
                >
                  {formatContent(keyword)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Button onClick={onReset} className="w-full">
        Optimize New Content
      </Button>
    </div>
  );
}