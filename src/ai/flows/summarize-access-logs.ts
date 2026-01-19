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
  logs: z.string().describe('A JSON string of access logs to be summarized.'),
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
  prompt: `You are a port security analyst. Your task is to summarize vehicle access logs for the Port Authority. The logs are provided as a JSON string.

Generate a concise summary based on the provided logs. Highlight key statistics like total access events, number of grants vs. denials, and identify any unusual patterns. For example, mention any vehicles with multiple denied access attempts or gates with unusually high activity.

The access logs are between {{startTime}} and {{endTime}}.
Here are the logs:
{{{logs}}}`,
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
