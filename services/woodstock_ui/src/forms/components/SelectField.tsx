import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from '/src/forms/components';
import { cn } from '/src/utils/classnames';

export type SelectOptionT = {
  value: string;
  label: string;
};

export type PropsT = {
  options: SelectOptionT[];
  placeholder?: string;
  className?: any;
};

export const SelectField = (props: PropsT) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();

  return (
    <select
      value={formState.getValue(fieldContext.fieldName) || ''}
      onChange={(e) =>
        formState.setValue(fieldContext.fieldName, e.target.value)
      }
      className={cn(
        'SelectField',
        'w-full px-3 py-2 text-sm border border-gray-300 rounded',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        props.className
      )}
    >
      {props.placeholder !== undefined && (
        <option value="">{props.placeholder}</option>
      )}
      {props.options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
