// src/app/api/payment/intent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server-config';
import { logError, createApiError, ApiError } from '@/lib/utils/error-logger';

export async function POST(request: NextRequest) {
  try {
    // Log the start of payment intent creation
    logError('Payment intent creation started', 'info', {
      timestamp: new Date().toISOString(),
      path: '/api/payment/intent'
    });

    const body = await request.json();
    const { amount, isGuest } = body;

    // Log the payment request details
    logError('Payment request received', 'info', {
      amount,
      isGuest,
      mode: process.env.NODE_ENV === 'production' ? 'live' : 'test'
    });

    // Validate amount
    if (!amount || typeof amount !== 'number') {
      throw createApiError('Invalid amount', 400, { 
        receivedAmount: amount,
        receivedType: typeof amount 
      });
    }

    try {
      // Create PaymentIntent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount, //amount is already in cents from frontend
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          isGuest: isGuest ? 'true' : 'false'
        }
      });

      // Log successful payment intent creation
      logError('Payment intent created successfully', 'info', {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        isGuest
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret
      });
      
    } catch (stripeError: unknown) {
      // Handle Stripe-specific errors
      const error = stripeError as { message?: string };
      throw createApiError(
        error.message || 'Stripe payment intent creation failed',
        500,
        { context: 'Stripe API' }
      );
    }
    
  } catch (e: unknown) {
    const error = e instanceof ApiError ? e : createApiError(
      e instanceof Error ? e.message : 'Payment intent creation failed',
      500,
      { context: 'Payment intent route handler' }
    );

    logError(error, 'error', {
      context: 'Payment processing',
      path: '/api/payment/intent'
    });

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
}