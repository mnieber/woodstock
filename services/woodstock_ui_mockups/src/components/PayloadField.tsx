type FieldType = 'value' | 'link' | 'ref' | 'tree';

interface PayloadFieldProps {
  fieldKey: string;
  value: string;
  type: FieldType;
}

export function PayloadField(props: PayloadFieldProps) {
  const renderValue = () => {
    switch (props.type) {
      case 'value':
        return <span className="text-gray-900">{props.value}</span>;

      case 'link':
        return (
          <a
            href={props.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
          >
            {props.value}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );

      case 'ref':
        return (
          <a
            href="#"
            className="text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
          >
            {props.value}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        );

      case 'tree':
        return (
          <button className="text-primary-600 hover:text-primary-700 hover:underline text-left">
            {props.value}
          </button>
        );

      default:
        return <span className="text-gray-900">{props.value}</span>;
    }
  };

  const typeColors = {
    value: 'bg-gray-100 text-gray-700',
    link: 'bg-blue-100 text-blue-700',
    ref: 'bg-purple-100 text-purple-700',
    tree: 'bg-green-100 text-green-700',
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm font-medium text-gray-700 min-w-fit">{props.fieldKey}:</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[props.type]}`}>
          {props.type}
        </span>
      </div>
      <div className="text-sm flex-1">
        {renderValue()}
      </div>
    </div>
  );
}
