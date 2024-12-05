// src/app/api/payment/intent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../../../smartaicopy-backup/stripe/server-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, isGuest } = body;

    // Validate amount
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create PaymentIntent with Stripe
    // Note: Stripe's test mode is automatically used when using test keys
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount is already in cents from frontend
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        isGuest: isGuest ? 'true' : 'false'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}