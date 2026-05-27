import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormState, FormStateProvider } from 'react-form-state-context';
import { withContextProps } from 'react-props-from-context';
import { form } from './form';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import {
  DateTimeField,
  Field,
  FormClearButton,
  FormFieldLabel,
  FormSaveButton,
  SelectField,
  TextField,
} from '/src/forms/components';
import { cn } from '/src/utils/classnames';

export const formFields = {
  traceKeyPrefix: 'traceKeyPrefix',
  traceState: 'traceState',
  author: 'author',
  timeRangeStart: 'timeRangeStart',
  timeRangeEnd: 'timeRangeEnd',
};

const traceStateOptions = [
  { value: 'ok', label: 'OK' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

const ContextProps = {
  filter: tracesCtx.filter,
  applyFilter: tracesCtx.applyFilter,
};

export type PropsT = {
  className?: any;
};

export const TraceFilterFormView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const initialValues = form.getInitialValues(props);
    const formStateRef = React.useRef<FormState>(null);

    const handleClear = () => {
      const fs = formStateRef.current;
      if (!fs) return;
      fs.setValue(formFields.traceKeyPrefix, '');
      fs.setValue(formFields.traceState, '');
      fs.setValue(formFields.author, '');
      fs.setValue(formFields.timeRangeStart, '');
      fs.setValue(formFields.timeRangeEnd, '');
      fs.submit();
    };

    return (
      <FormStateProvider
        formStateRef={formStateRef}
        initialValues={initialValues}
        initialErrors={{}}
        handleValidate={form.getHandleValidate()}
        handleSubmit={form.getHandleSubmit(props)}
      >
        <div
          className={cn('TraceFilterFormView', [
            'flex flex-col gap-3 px-2',
            props.className,
          ])}
        >
          <h3 className="text-sm font-semibold text-gray-700">Filter Traces</h3>

          <Field fieldName={formFields.traceKeyPrefix} tabOnEnter={true}>
            <FormFieldLabel label="Trace Key Prefix" />
            <TextField placeholder="e.g., job-123" />
          </Field>

          <Field fieldName={formFields.traceState}>
            <FormFieldLabel label="State" />
            <SelectField options={traceStateOptions} placeholder="All States" />
          </Field>

          <Field fieldName={formFields.author} tabOnEnter={true}>
            <FormFieldLabel label="Author" />
            <TextField placeholder="e.g., alice" />
          </Field>

          <Field fieldName={formFields.timeRangeStart} tabOnEnter={true}>
            <FormFieldLabel label="Start Time" />
            <DateTimeField />
          </Field>

          <Field fieldName={formFields.timeRangeEnd} submitOnEnter={true}>
            <FormFieldLabel label="End Time" />
            <DateTimeField />
          </Field>

          <div className="flex gap-2 pt-2">
            <FormSaveButton label="Apply" className="flex-1" />
            <FormClearButton
              label="Clear"
              onClick={handleClear}
              className="flex-1"
            />
          </div>
        </div>
      </FormStateProvider>
    );
  }, ContextProps)
);
