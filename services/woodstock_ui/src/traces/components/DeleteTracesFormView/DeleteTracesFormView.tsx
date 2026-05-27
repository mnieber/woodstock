import { observer } from 'mobx-react-lite';
import { isUpdating } from 'mobx-resource-states';
import { FormStateProvider } from 'react-form-state-context';
import { withContextProps } from 'react-props-from-context';
import { form, formFields } from './form';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { Deletion } from '/src/traces/TracesState/facets/Deletion';
import {
  Field,
  FormFieldLabel,
  FormSaveButton,
  SelectField,
  TextField,
} from '/src/forms/components';
import { cn } from '/src/utils/classnames';

const unitOptions = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
];

const ContextProps = {
  traces: tracesCtx.traces,
  tracesDeletion: tracesCtx.tracesDeletion as any as Deletion,
};

export type PropsT = {
  className?: any;
};

export const DeleteTracesFormView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const initialValues = form.getInitialValues();
    const isDeleting = isUpdating(props.traces);

    return (
      <FormStateProvider
        initialValues={initialValues}
        initialErrors={{}}
        handleValidate={form.getHandleValidate()}
        handleSubmit={form.getHandleSubmit(props)}
      >
        <div
          className={cn('DeleteTracesFormView', [
            'flex flex-col gap-3 px-2',
            props.className,
          ])}
        >
          <h3 className="text-sm font-semibold text-gray-700">Delete Traces</h3>

          <div className="flex gap-2 items-end">
            <Field fieldName={formFields.olderThan} className="flex-1">
              <FormFieldLabel label="Older than" />
              <TextField placeholder="7" />
            </Field>

            <Field fieldName={formFields.unit} className="flex-1">
              <FormFieldLabel label="Unit" />
              <SelectField options={unitOptions} />
            </Field>
          </div>

          <div className="pt-1">
            <FormSaveButton
              label={isDeleting ? 'Deleting…' : 'Delete'}
              disabled={isDeleting}
              className="w-full bg-red-500 hover:bg-red-600"
            />
          </div>
        </div>
      </FormStateProvider>
    );
  }, ContextProps)
);
