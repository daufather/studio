'use server';

import { summarizeAccessLogs, SummarizeAccessLogsInput } from '@/ai/flows/summarize-access-logs';

export async function getAccessLogSummary(input: SummarizeAccessLogsInput) {
  try {
    const result = await summarizeAccessLogs(input);
    return result.summary;
  } catch (error) {
    console.error("Error getting access log summary:", error);
    return "Failed to generate summary. Please try again later.";
  }
}
