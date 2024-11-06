'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onPaymentComplete: () => void;
  wordCount: number;
}

export default function PaymentModal({ 
  amount, 
  onClose, 
  onPaymentComplete,
  wordCount 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleDemoPayment = async () => {
    setIsProcessing(true);
    setError('');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card variant="primary" className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Complete Your Purchase</h3>
            <p className="mt-2 text-secondary">
              {wordCount.toLocaleString()} words optimization
            </p>
          </div>

          <div className="border-t border-b border-foreground/10 py-4">
            <div className="flex justify-between items-center">
              <span>Amount:</span>
              <span className="text-lg font-medium">${amount}</span>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleDemoPayment}
              disabled={isProcessing}
              isLoading={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : `Pay $${amount}`}
            </Button>
            
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={isProcessing}
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-center text-secondary">
            Secure payment processing coming soon
          </p>
        </div>
      </Card>
    </div>
  );
}