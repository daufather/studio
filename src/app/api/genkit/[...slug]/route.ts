import { genkitAPI } from '@genkit-ai/next';
import { ai } from '@/ai/genkit';

// Make sure to import all flows that you want to expose via the API.
import '@/ai/flows/summarize-access-logs';

export const { GET, POST } = genkitAPI({
  ai,
});
