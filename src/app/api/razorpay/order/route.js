import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const { amount, receipt } = await request.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Detect if key placeholders are present or keys are not defined
    if (!keyId || !keySecret || keyId.includes('yourKeyId') || keySecret.includes('yourKeySecret')) {
      return NextResponse.json({
        isSandbox: true,
        id: 'order_mock_' + Math.random().toString(36).substring(2, 15),
        amount: amount,
        currency: 'INR',
        receipt: receipt || 'receipt_mock_123',
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount), // in paise (e.g., 500 Rs = 50000 paise)
      currency: 'INR',
      receipt: receipt || 'receipt_' + Date.now(),
    };

    const order = await instance.orders.create(options);
    return NextResponse.json({ ...order, isSandbox: false });
  } catch (error) {
    console.error('Razorpay Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
