'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting entry purposes based on previous entries.
 *
 * - suggestEntryPurpose - A function that suggests entry purposes based on the provided input.
 * - SuggestEntryPurposeInput - The input type for the suggestEntryPurpose function.
 * - SuggestEntryPurposeOutput - The output type for the suggestEntryPurpose function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEntryPurposeInputSchema = z.object({
  partialPurpose: z
    .string()
    .describe("The partial entry purpose text that the user has typed so far."),
  previousPurposes: z
    .array(z.string())
    .describe("A list of previously entered purposes."),
});
export type SuggestEntryPurposeInput = z.infer<typeof SuggestEntryPurposeInputSchema>;

const SuggestEntryPurposeOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe("A list of suggested entry purposes based on previous entries."),
});
export type SuggestEntryPurposeOutput = z.infer<typeof SuggestEntryPurposeOutputSchema>;

export async function suggestEntryPurpose(input: SuggestEntryPurposeInput): Promise<SuggestEntryPurposeOutput> {
  return suggestEntryPurposeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEntryPurposePrompt',
  input: {schema: SuggestEntryPurposeInputSchema},
  output: {schema: SuggestEntryPurposeOutputSchema},
  prompt: `You are an AI assistant that suggests entry purposes based on previous entries.

The user is typing an entry purpose, and you should suggest completions based on the previous entries.
Only suggest options that are highly relevant to the partial input. If the partial input is novel, suggest an empty array.

Partial Input: {{{partialPurpose}}}
Previous Entries: {{#each previousPurposes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggestions:`,
});

const suggestEntryPurposeFlow = ai.defineFlow(
  {
    name: 'suggestEntryPurposeFlow',
    inputSchema: SuggestEntryPurposeInputSchema,
    outputSchema: SuggestEntryPurposeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
