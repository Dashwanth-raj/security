// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Handles novel entry purpose descriptions by prompting the user for clarification.
 *
 * - handleNovelDescription - A function that takes a novel description and returns a clarification prompt.
 * - HandleNovelDescriptionInput - The input type for the handleNovelDescription function.
 * - HandleNovelDescriptionOutput - The return type for the handleNovelDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleNovelDescriptionInputSchema = z.object({
  description: z.string().describe('The novel entry purpose description provided by the user.'),
});
export type HandleNovelDescriptionInput = z.infer<typeof HandleNovelDescriptionInputSchema>;

const HandleNovelDescriptionOutputSchema = z.object({
  clarificationPrompt: z.string().describe('A prompt asking the user for more details or clarification about the entry purpose.'),
});
export type HandleNovelDescriptionOutput = z.infer<typeof HandleNovelDescriptionOutputSchema>;

export async function handleNovelDescription(input: HandleNovelDescriptionInput): Promise<HandleNovelDescriptionOutput> {
  return handleNovelDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleNovelDescriptionPrompt',
  input: {schema: HandleNovelDescriptionInputSchema},
  output: {schema: HandleNovelDescriptionOutputSchema},
  prompt: `You have received a novel or uncommon entry purpose description. Your task is to generate a clarifying question to ask the user for more details.  The goal is to obtain enough information to accurately record the purpose and improve future suggestions.

Description: {{{description}}}

Clarification Prompt: `,
});

const handleNovelDescriptionFlow = ai.defineFlow(
  {
    name: 'handleNovelDescriptionFlow',
    inputSchema: HandleNovelDescriptionInputSchema,
    outputSchema: HandleNovelDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
