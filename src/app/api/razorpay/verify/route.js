import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Detect if key secret is placeholder or if this is a mock order
    if (!keySecret || keySecret.includes('yourKeySecret') || (razorpay_order_id && razorpay_order_id.startsWith('order_mock_'))) {
      return NextResponse.json({ verified: true, isSandbox: true });
    }

    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      return NextResponse.json({ verified: true, isSandbox: false });
    } else {
      return NextResponse.json({ verified: false, error: 'Signature mismatch' }, { status: 400 });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
