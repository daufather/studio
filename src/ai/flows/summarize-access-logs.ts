'use server';

/**
 * @fileOverview Summarizes access logs for a specific time period, providing an overview of activity and identifying unusual patterns.
 *
 * - summarizeAccessLogs - A function that generates a summary of access logs.
 * - SummarizeAccessLogsInput - The input type for the summarizeAccessLogs function.
 * - SummarizeAccessLogsOutput - The return type for the summarizeAccessLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAccessLogsInputSchema = z.object({
  startTime: z.string().describe('The start time for the logs summary (ISO format).'),
  endTime: z.string().describe('The end time for the logs summary (ISO format).'),
});
export type SummarizeAccessLogsInput = z.infer<typeof SummarizeAccessLogsInputSchema>;

const SummarizeAccessLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the access logs for the specified time period.'),
});
export type SummarizeAccessLogsOutput = z.infer<typeof SummarizeAccessLogsOutputSchema>;

export async function summarizeAccessLogs(input: SummarizeAccessLogsInput): Promise<SummarizeAccessLogsOutput> {
  return summarizeAccessLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAccessLogsPrompt',
  input: {schema: SummarizeAccessLogsInputSchema},
  output: {schema: SummarizeAccessLogsOutputSchema},
  prompt: `You are an expert system administrator summarizing access logs.

  Generate a concise summary of the access logs between {{startTime}} and {{endTime}}.
  Identify any unusual patterns or anomalies in the logs.
  Focus on providing a high-level overview of the activity during this period.
  `,
});

const summarizeAccessLogsFlow = ai.defineFlow(
  {
    name: 'summarizeAccessLogsFlow',
    inputSchema: SummarizeAccessLogsInputSchema,
    outputSchema: SummarizeAccessLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
