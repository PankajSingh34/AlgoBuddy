import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/serverApi';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Insert into newsletter_subscribers table
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      // 23505 is the unique violation error code in PostgreSQL
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 409 }
        );
      }
      console.error('Error inserting newsletter subscription:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
