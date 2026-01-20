import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Genkit API route not configured' }, { status: 501 });
}

export async function POST() {
    return NextResponse.json({ message: 'Genkit API route not configured' }, { status: 501 });
}
