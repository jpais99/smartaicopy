// src/app/api/payment/webhook/route.ts

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server-config';
import { getMongoDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { logError } from '@/lib/utils/error-logger';

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 503 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logError('Missing Stripe webhook secret', 'error');
      return NextResponse.json(
        { error: 'Webhook configuration error' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') || '';

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;

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

        logError('Payment succeeded', 'info', {
          userId,
          paymentIntentId: paymentIntent.id
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;

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

        logError('Payment failed', 'error', {
          userId,
          paymentIntentId: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err instanceof Error ? err : 'Webhook processing failed';
    logError(error, 'error', { context: 'Stripe webhook' });
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};