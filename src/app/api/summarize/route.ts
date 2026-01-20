'use server';

import { NextResponse } from 'next/server';
import { summarizeAccessLogs, type SummarizeAccessLogsInput } from '@/ai/flows/summarize-access-logs';

export async function POST(request: Request) {
  try {
    const body: SummarizeAccessLogsInput = await request.json();
    const result = await summarizeAccessLogs(body);
    return NextResponse.json({ summary: result.summary });
  } catch (error: any) {
    console.error("Error in /api/summarize:", error);
    return NextResponse.json(
      { error: "Failed to generate summary.", details: error.message },
      { status: 500 }
    );
  }
}
