import { cn } from '/src/utils/classnames';

type PropsT = {
  className?: any;
  label: string;
};

export const FormFieldLabel = (props: PropsT) => {
  return (
    <label className={cn('FormFieldLabel', 'text-xs font-medium text-gray-600', props.className)}>
      {props.label}
    </label>
  );
};
