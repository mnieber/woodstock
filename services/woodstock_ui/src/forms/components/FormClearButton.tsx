import { cn } from '/src/utils/classnames';

export type PropsT = {
  label: string;
  onClick: () => void;
  className?: any;
};

export const FormClearButton = (props: PropsT) => {
  const { label, onClick, className } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'FormClearButton',
        'px-4 py-2 text-sm rounded transition-colors',
        'bg-gray-200 text-gray-700 hover:bg-gray-300',
        className
      )}
    >
      {label}
    </button>
  );
};
