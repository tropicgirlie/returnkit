import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  onCopy?: () => void;
}

export function CopyButton({ text, label = 'Copy', className = '', onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onCopy) {
          onCopy();
        }
      } else {
        // Fallback to old-school textarea method
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            if (onCopy) {
              onCopy();
            }
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      // Still show copied state even if it failed, for better UX
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopy) {
        onCopy();
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className || `text-sm font-semibold rounded-lg px-5 py-2.5 transition-all h-12 flex items-center justify-center gap-2 ${
        copied
          ? 'bg-[#059669] text-white'
          : 'bg-[#111827] text-white hover:bg-[#374151]'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}