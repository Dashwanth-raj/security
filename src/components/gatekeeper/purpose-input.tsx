'use client';

import { useEffect, useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb } from 'lucide-react';
import { suggestEntryPurpose, SuggestEntryPurposeInput } from '@/ai/flows/suggest-entry-purpose';
import { handleNovelDescription, HandleNovelDescriptionInput } from '@/ai/flows/handle-novel-description';
import type { PurposeSuggestion } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface PurposeInputProps {
  value: string;
  onChange: (value: string) => void;
  previousPurposes: string[];
}

// Basic debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

export default function PurposeInput({ value, onChange, previousPurposes }: PurposeInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [clarificationPrompt, setClarificationPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = useCallback(async (currentValue: string) => {
    if (!currentValue || currentValue.length < 3) {
      setSuggestions([]);
      setClarificationPrompt(null);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const input: SuggestEntryPurposeInput = {
        partialPurpose: currentValue,
        previousPurposes: previousPurposes,
      };
      const result = await suggestEntryPurpose(input);
      setSuggestions(result.suggestions || []);

      if ((!result.suggestions || result.suggestions.length === 0) && currentValue.length > 5) {
        const novelInput: HandleNovelDescriptionInput = { description: currentValue };
        const clarificationResult = await handleNovelDescription(novelInput);
        setClarificationPrompt(clarificationResult.clarificationPrompt);
      } else {
        setClarificationPrompt(null);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: 'AI Suggestion Error',
        description: 'Could not fetch purpose suggestions at this time.',
        variant: 'destructive',
      });
      setSuggestions([]);
      setClarificationPrompt(null);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [previousPurposes, toast]);

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), [fetchSuggestions]);

  useEffect(() => {
    if (value) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
      setClarificationPrompt(null);
    }
  }, [value, debouncedFetchSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setClarificationPrompt(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="purpose">Purpose of Entry</Label>
      <Textarea
        id="purpose"
        placeholder="e.g., Delivery, Meeting with John Doe, Visitor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="text-base"
        aria-label="Purpose of Entry"
      />
      {isLoadingSuggestions && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading AI suggestions...
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="space-y-1 pt-1">
          <p className="text-xs text-muted-foreground">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(s)}
                className="bg-accent/10 hover:bg-accent/20 text-accent-foreground border-accent/30"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}
      {clarificationPrompt && !isLoadingSuggestions && suggestions.length === 0 && (
         <div className="p-3 mt-2 text-sm text-primary bg-primary/10 border border-primary/20 rounded-md flex items-start">
            <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
            <span>{clarificationPrompt}</span>
        </div>
      )}
    </div>
  );
}
