// src/app/api/payment/webhook/route.ts

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server-config';
import { getMongoDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing Stripe webhook secret');
    return NextResponse.json(
      { error: 'Webhook secret missing' },
      { status: 500 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature ?? '',  // Changed to nullish coalescing
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;

        // Update optimization record with payment success
        const db = await getMongoDb();
        await db.collection('optimizations').updateOne(
          { 
            userId: new ObjectId(userId),
            'payment.status': 'pending'
          },
          {
            $set: {
              'payment.status': 'completed',
              'payment.completedAt': new Date(),
              'payment.stripePaymentIntentId': paymentIntent.id
            }
          }
        );

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;

        // Update optimization record with payment failure
        const db = await getMongoDb();
        await db.collection('optimizations').updateOne(
          { 
            userId: new ObjectId(userId),
            'payment.status': 'pending'
          },
          {
            $set: {
              'payment.status': 'failed',
              'payment.error': paymentIntent.last_payment_error?.message || 'Payment failed'
            }
          }
        );

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};