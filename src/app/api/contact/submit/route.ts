// src/app/api/contact/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ContactSubmission, saveContactSubmission } from '@/lib/db/contact';
import { sendContactNotification } from '@/lib/utils/email';
import { logError, createApiError } from '@/lib/utils/error-logger';

const VALID_CATEGORIES = ['technical', 'billing', 'feature', 'account', 'general'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log request received
    logError('Contact form submission received', 'info', {
      category: body.category,
      hasAccountEmail: !!body.accountEmail,
      hasTransactionId: !!body.transactionId
    });

    // Validate required fields
    if (!body.name?.trim()) {
      throw createApiError('Name is required', 400);
    }
    if (!body.email?.trim()) {
      throw createApiError('Email is required', 400);
    }
    if (!body.category?.trim() || !VALID_CATEGORIES.includes(body.category)) {
      throw createApiError('Valid category is required', 400);
    }
    if (!body.subject?.trim()) {
      throw createApiError('Subject is required', 400);
    }
    if (!body.message?.trim()) {
      throw createApiError('Message is required', 400);
    }

    // Create submission object
    const submission: Omit<ContactSubmission, '_id'> = {
      name: body.name.trim(),
      email: body.email.trim(),
      category: body.category,
      subject: body.subject.trim(),
      message: body.message.trim(),
      accountEmail: body.accountEmail?.trim() || undefined,
      transactionId: body.transactionId?.trim() || undefined,
      timestamp: new Date()
    };

    // Save to database
    await saveContactSubmission(submission);

    // Send email notification
    try {
      await sendContactNotification(submission);
    } catch (emailError) {
      // Log email error but don't fail the request
      logError(emailError, 'error', {
        context: 'Email notification',
        submission: submission
      });
    }

    return NextResponse.json({ success: true });

  } catch (e) {
    const error = e instanceof Error ? e : new Error('Failed to process contact submission');
    logError(error, 'error', {
      context: 'Contact submission handler'
    });

    return NextResponse.json(
      { error: error.message },
      { status: (e as any).statusCode || 500 }
    );
  }
}