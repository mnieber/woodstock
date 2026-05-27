import { FormState } from 'react-form-state-context';
import { formFields as ff } from './TraceFilterFormView';
import { TraceFilterT } from '/src/api/types/TraceFilterT';

export type FormPropsT = {
  setTraceFilterOptions: (options: TraceFilterT) => void;
};

const getInitialValues = () => {
  return {
    [ff.traceKeyPrefix]: '',
    [ff.traceState]: '',
    [ff.author]: '',
    [ff.timeRangeStart]: '',
    [ff.timeRangeEnd]: '',
  };
};

const getHandleValidate =
  () =>
  (_: { values: FormState['values']; setError: FormState['setError'] }) => {};

const getHandleSubmit =
  (props: FormPropsT) =>
  async ({ values }: { values: FormState['values'] }) => {
    const options: TraceFilterT = {};
    if (values[ff.traceKeyPrefix]) options.traceKeyPrefix = values[ff.traceKeyPrefix];
    if (values[ff.traceState]) options.traceState = values[ff.traceState];
    if (values[ff.author]) options.author = values[ff.author];
    if (values[ff.timeRangeStart]) options.timeRangeStart = values[ff.timeRangeStart];
    if (values[ff.timeRangeEnd]) options.timeRangeEnd = values[ff.timeRangeEnd];
    props.setTraceFilterOptions(options);
  };

export const form = {
  getInitialValues,
  getHandleValidate,
  getHandleSubmit,
};
