import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const file = readFileSync('/Users/mark/.gemini/antigravity-ide/brain/777a0a11-5601-4a84-abfd-9467971eed5e/media__1782354264401.jpg');
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Error loading image', { status: 500 });
  }
}
