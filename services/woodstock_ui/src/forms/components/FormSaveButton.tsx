import { useFormStateContext } from 'react-form-state-context';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  label: string;
  className?: any;
  disabled?: boolean;
  [k: string]: any;
};

export const FormSaveButton = (props: PropsT) => {
  const formState = useFormStateContext();
  const { label, className, disabled, ...rest } = props;
  const isDisabled = disabled || formState.getFlag('submitting');

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        formState.submit();
      }}
      disabled={isDisabled}
      className={cn(
        'FormSaveButton',
        'px-4 py-2 text-sm rounded transition-colors',
        'bg-blue-500 text-white hover:bg-blue-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {label}
    </button>
  );
};
