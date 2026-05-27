import { FormState } from 'react-form-state-context';
import { Deletion } from '/src/traces/TracesState/facets/Deletion';

export const formFields = {
  olderThan: 'olderThan',
  unit: 'unit',
};

export type UnitT = 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

export type FormPropsT = {
  tracesDeletion: Deletion;
};

const unitToMs: Record<UnitT, number> = {
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
  months: 30 * 24 * 60 * 60 * 1000,
};

const getInitialValues = () => ({
  [formFields.olderThan]: '7',
  [formFields.unit]: 'days' as UnitT,
});

const getHandleValidate =
  () =>
  ({
    values,
    setError,
  }: {
    values: FormState['values'];
    setError: FormState['setError'];
  }) => {
    const n = Number(values[formFields.olderThan]);
    if (!Number.isFinite(n) || n <= 0) {
      setError(formFields.olderThan, 'Must be a positive number');
    }
  };

const getHandleSubmit =
  (props: FormPropsT) =>
  async ({ values }: { values: FormState['values'] }) => {
    const n = Number(values[formFields.olderThan]);
    const unit = values[formFields.unit] as UnitT;
    const cutoff = new Date(Date.now() - n * unitToMs[unit]);
    props.tracesDeletion.deleteOldTraces(cutoff.toISOString());
  };

export const form = {
  getInitialValues,
  getHandleValidate,
  getHandleSubmit,
};
