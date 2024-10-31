// src/lib/utils/text-processing.ts
// Utility functions for text manipulation and optimization

// Clean and normalize text input
export function normalizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\S\r\n]+/g, ' '); // Replace multiple whitespace with single space, preserve newlines
   }
   
   // Calculate text metrics
   export function getTextMetrics(text: string) {
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const characters = text.length;
   
    return {
      words,
      sentences,
      characters,
      readingTime: Math.ceil(words / 200), // Assuming 200 words per minute reading speed
    };
   }
   
   // Format text according to selected style
   export type TextStyle = 'formal' | 'casual' | 'technical' | 'creative';
   
   export function getStyleGuide(style: TextStyle) {
    const guides = {
      formal: {
        avoidContractions: true,
        preferLongerWords: true,
        tone: 'professional',
      },
      casual: {
        avoidContractions: false,
        preferLongerWords: false,
        tone: 'conversational',
      },
      technical: {
        avoidContractions: true,
        preferLongerWords: true,
        tone: 'precise',
      },
      creative: {
        avoidContractions: false,
        preferLongerWords: false,
        tone: 'expressive',
      },
    };
   
    return guides[style];
   }