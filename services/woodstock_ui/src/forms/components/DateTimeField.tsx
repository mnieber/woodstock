import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from '/src/forms/components';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

export const DateTimeField = (props: PropsT) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();

  return (
    <input
      type="datetime-local"
      value={formState.getValue(fieldContext.fieldName) || ''}
      onChange={(e) =>
        formState.setValue(fieldContext.fieldName, e.target.value)
      }
      className={cn(
        'DateTimeField',
        'w-full px-3 py-2 text-sm border border-gray-300 rounded',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        props.className
      )}
    />
  );
};
