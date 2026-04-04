import { FormState } from 'react-form-state-context';
import { formFields as ff } from './index';
import { Filter } from '/src/traces/TracesState/facets/Filter';

export type FormPropsT = {
  filter: Filter;
  applyFilter: () => void;
};

const getInitialValues = (props: FormPropsT) => {
  return {
    [ff.traceKeyPrefix]: props.filter.traceKeyPrefix || '',
    [ff.traceState]: props.filter.traceState || '',
    [ff.author]: props.filter.author || '',
    [ff.timeRangeStart]: props.filter.timeRangeStart || '',
    [ff.timeRangeEnd]: props.filter.timeRangeEnd || '',
  };
};

const getHandleValidate = () => ({
  values,
  setError,
}: {
  values: FormState['values'];
  setError: FormState['setError'];
}) => {
  // No validation required for filter form - all fields are optional
};

const getHandleSubmit =
  (props: FormPropsT) =>
  async ({ values }: { values: FormState['values'] }) => {
    // Update the filter facet with form values
    props.filter.setTraceKeyPrefix(values[ff.traceKeyPrefix] || '');
    props.filter.setTraceState(values[ff.traceState] || '');
    props.filter.setAuthor(values[ff.author] || '');
    props.filter.setTimeRangeStart(values[ff.timeRangeStart] || '');
    props.filter.setTimeRangeEnd(values[ff.timeRangeEnd] || '');

    // Trigger the query with the new filter
    props.applyFilter();
  };

export const form = {
  getInitialValues,
  getHandleValidate,
  getHandleSubmit,
};
