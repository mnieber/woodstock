import React, { useState } from 'react';
import { BlobContentT } from '/src/api/types/BlobContentT';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  blob: BlobContentT;
  className?: any;
};

const isJsonContent = (content: string): boolean => {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
};

const isMarkdownContent = (path: string): boolean => {
  return path.endsWith('.md') || path.endsWith('.markdown');
};

export const BlobContentView: React.FC<PropsT> = (props: PropsT) => {
  const [_, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(props.blob.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenRaw = () => {
    const blob = new Blob([props.blob.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Extract filename from path
  const filename = props.blob.path.split('/').pop() || props.blob.path;

  // Determine content type and format
  let formattedContent = props.blob.content;
  let contentType = 'plain';

  if (isJsonContent(props.blob.content)) {
    try {
      formattedContent = JSON.stringify(
        JSON.parse(props.blob.content),
        null,
        2
      );
      contentType = 'json';
    } catch {
      // Fall back to plain text
    }
  } else if (isMarkdownContent(props.blob.path)) {
    contentType = 'markdown';
  }

  return (
    <div
      className={cn(
        'BlobContentView bg-white rounded-lg border shadow-sm overflow-hidden',
        props.className
      )}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenRaw}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline font-mono inline-flex items-center gap-1"
            title={`Open ${filename} in new tab`}
          >
            {filename}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
        <span className="text-xs text-gray-500">{`tree://${props.blob.path}`}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {contentType === 'json' && (
          <pre className="text-xs overflow-x-auto">
            <code className="text-gray-800">{formattedContent}</code>
          </pre>
        )}
        {contentType === 'markdown' && (
          <div className="prose prose-sm max-w-none">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              <code className="text-gray-800">{formattedContent}</code>
            </pre>
          </div>
        )}
        {contentType === 'plain' && (
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
            <code className="text-gray-800">{formattedContent}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
