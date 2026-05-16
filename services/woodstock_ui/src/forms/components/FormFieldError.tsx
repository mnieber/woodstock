import { observer } from 'mobx-react-lite';
import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from '/src/forms/components';
import { cn } from '/src/utils/classnames';

import './FormFieldError.scss';

export type PropsT = {
  className?: any;
};

export const FormFieldError = observer((props: PropsT) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();

  const error = formState.getError(fieldContext.fieldName);

  return error ? (
    <div className={cn('FormFieldError', props.className)}>{error}</div>
  ) : null;
});
