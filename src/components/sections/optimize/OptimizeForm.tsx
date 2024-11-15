// src/components/sections/optimize/OptimizeForm.tsx
'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface OptimizeFormProps {
  onSubmit?: (data: {
    content: string;
    wordCount: number;
    price: number;
  }) => Promise<void>;
  isLoading?: boolean; // Add this prop
}

export default function OptimizeForm({ onSubmit, isLoading = false }: OptimizeFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [truncated, setTruncated] = useState(false);

  // Clean incoming content and preserve formatting
  const processContent = (text: string) => {
    // Remove any content that looks like a title at the start
    const cleanedText = text.replace(/^(?:#+ |.*\n={3,}|.*\n-{3,})/g, '').trim();
    
    const words = cleanedText.split(/\s+/);
    if (words.length > 3000) {
      const truncatedText = words.slice(0, 3000).join(' ');
      setContent(truncatedText);
      setTruncated(true);
      return truncatedText;
    }
    setTruncated(false);
    return cleanedText;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setError('');

    try {
      const contentToSubmit = content.replace(/^(?:#+ |.*\n={3,}|.*\n-{3,})/g, '').trim();
      
      if (onSubmit) {
        await onSubmit({
          content: contentToSubmit,
          wordCount,
          price
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const convertMarkdownToHtml = (text: string) => {
    // Convert markdown bold to HTML
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const preserveParagraphBreaks = (text: string) => {
    // Convert single newlines to spaces (like markdown)
    // Convert double newlines to paragraphs
    return text
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, ' ')
      .trim();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    let processedContent = '';
    const plainText = e.clipboardData.getData('text/plain');
    const htmlContent = e.clipboardData.getData('text/html');
    
    if (htmlContent) {
      // Create a temporary container to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = htmlContent;
      
      // Clean up the HTML content
      temp.querySelectorAll('*').forEach(element => {
        // Keep only specific formatting
        if (!['B', 'STRONG', 'P', 'BR'].includes(element.tagName)) {
          // Replace element with its text content
          const text = element.textContent || '';
          element.replaceWith(text);
        }
      });
      
      processedContent = temp.innerHTML;
    } else {
      // Handle plain text with potential markdown
      processedContent = plainText;
      
      // Convert markdown formatting
      processedContent = convertMarkdownToHtml(processedContent);
      
      // Preserve paragraph breaks
      processedContent = `<p>${preserveParagraphBreaks(processedContent)}</p>`;
    }
    
    // Process for word count and truncation
    const textOnlyContent = processedContent.replace(/<[^>]+>/g, ' ').trim();
    const processed = processContent(textOnlyContent);
    setContent(processed);
    
    // Insert the HTML content
    const targetDiv = e.currentTarget as HTMLDivElement;
    targetDiv.innerHTML = processedContent;
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const price = wordCount <= 1500 ? 25 : 50;
  const isValid = content.trim().length > 0;

  return (
    <Card variant="primary">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-lg font-medium text-foreground"
          >
            Your Content
          </label>
          <div
            className={`
              w-full min-h-[200px] p-4
              bg-background
              border rounded-lg
              text-foreground
              transition-colors
              ${error ? 'border-red-500' : 'border-foreground/20 hover:border-foreground/30'}
              overflow-auto
            `.trim()}
          >
            <div
              contentEditable
              id="content"
              role="textbox"
              aria-multiline="true"
              aria-label="Content input"
              className="outline-none min-h-[180px]"
              onInput={(e) => {
                const text = e.currentTarget.innerText;
                const processed = processContent(text);
                setContent(processed);
              }}
              onPaste={handlePaste}
              suppressContentEditableWarning={true}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span id="word-count" className="text-secondary">
                {wordCount} words {wordCount === 3000 && "(maximum)"}
              </span>
              <span className="text-secondary">
                Price: ${price}
              </span>
            </div>
            {truncated && (
              <p className="text-accent" role="alert">
                Content has been truncated to 3000 words.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        >
          Optimize Content
        </Button>
      </form>
    </Card>
  );
}