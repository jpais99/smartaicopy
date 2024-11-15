// src/components/sections/dashboard/OptimizationDetails.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { OptimizationResult } from '@/lib/api/content/types';

interface OptimizationDetailsProps {
  optimization: OptimizationResult;
  onClose: () => void;
}

export default function OptimizationDetails({ 
  optimization, 
  onClose 
}: OptimizationDetailsProps) {
  const [tab, setTab] = useState<'original' | 'optimized'>('optimized');

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm text-gray-500">
            {new Date(optimization.metadata.timestamp).toLocaleDateString()} at{' '}
            {new Date(optimization.metadata.timestamp).toLocaleTimeString()}
          </div>
          <h3 className="text-xl font-medium mt-1">
            {optimization.metadata.titles?.[0] || 'Optimized Content'}
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="!w-auto"
          aria-label="Close details"
        >
          Close
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Button
          variant={tab === 'original' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTab('original')}
          className="!w-auto"
        >
          Original
        </Button>
        <Button
          variant={tab === 'optimized' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTab('optimized')}
          className="!w-auto"
        >
          Optimized
        </Button>
      </div>

      <div className="mb-4">
        <div className="prose max-w-none">
          {tab === 'original' ? (
            <div className="whitespace-pre-wrap">{optimization.originalContent}</div>
          ) : (
            <div className="whitespace-pre-wrap">{optimization.optimizedContent}</div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium mb-2">Metadata</h4>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Word Count</dt>
            <dd className="text-sm font-medium">
              {optimization.metadata.wordCount.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Price</dt>
            <dd className="text-sm font-medium">${optimization.metadata.price}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-500">Keywords</dt>
            <dd className="flex flex-wrap gap-2 mt-1">
              {optimization.metadata.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {keyword}
                </span>
              ))}
            </dd>
          </div>
          {optimization.metadata.metaDescription && (
            <div className="col-span-2">
              <dt className="text-sm text-gray-500">Meta Description</dt>
              <dd className="text-sm mt-1">{optimization.metadata.metaDescription}</dd>
            </div>
          )}
        </dl>
      </div>
    </Card>
  );
}