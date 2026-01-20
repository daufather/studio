// This route is deprecated and no longer in use.
// AI summaries are now handled by /api/genkit/flow/summarizeAccessLogsFlow
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    return NextResponse.json(
      { error: "This endpoint is deprecated." },
      { status: 410 } // 410 Gone
    );
}
