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
  const [copied, setCopied] = useState(false);

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
      formattedContent = JSON.stringify(JSON.parse(props.blob.content), null, 2);
      contentType = 'json';
    } catch {
      // Fall back to plain text
    }
  } else if (isMarkdownContent(props.blob.path)) {
    contentType = 'markdown';
  }

  return (
    <div className={cn('BlobContentView border rounded-lg overflow-hidden', props.className)}>
      {/* Header */}
      <div className="bg-gray-100 border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={handleOpenRaw}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate"
            title={filename}
          >
            {filename}
          </button>
          <span className="text-xs text-gray-500 truncate">{props.blob.path}</span>
        </div>
        <button
          onClick={handleCopy}
          className="ml-3 px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        {contentType === 'json' && (
          <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
            {formattedContent}
          </pre>
        )}
        {contentType === 'markdown' && (
          <div className="prose prose-sm max-w-none">
            <pre className="text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {formattedContent}
            </pre>
          </div>
        )}
        {contentType === 'plain' && (
          <pre className="text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
            {formattedContent}
          </pre>
        )}
      </div>
    </div>
  );
};
