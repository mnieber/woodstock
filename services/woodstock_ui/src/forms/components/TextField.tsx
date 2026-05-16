import { FieldPropsT, useFieldProps } from '/src/forms/hooks';
import { cn } from '/src/utils/classnames';

import './TextField.scss';

export type PropsT = Partial<FieldPropsT> & {
  placeholder?: string;
  className?: any;
};

export const TextField = (props: PropsT) => {
  const fieldProps = useFieldProps({
    ...props,
    fieldType: props.fieldType ?? 'text',
  });

  return (
    <input
      placeholder={props.placeholder}
      {...fieldProps}
      className={cn(
        'TextField',
        'w-full px-3 py-2 text-sm border border-gray-300 rounded',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        props.className
      )}
    />
  );
};
