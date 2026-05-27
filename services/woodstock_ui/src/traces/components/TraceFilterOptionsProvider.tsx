import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { TraceFilterT } from '/src/api/types/TraceFilterT';
import { createGetProps } from '/src/utils/createGetProps';
import { useBuilder } from '/src/utils/hooks/useBuilder';

export type PropsT = React.PropsWithChildren<{}>;

const TraceFilterOptionsContext = React.createContext<any>(null);

export const useTraceFilterOptionsContext = () => {
  const ctx = React.useContext(TraceFilterOptionsContext);
  if (!ctx) {
    throw new Error(
      'useTraceFilterOptionsContext must be used within TraceFilterOptionsProvider'
    );
  }
  return ctx;
};

export const TraceFilterOptionsProvider = observer((props: PropsT) => {
  const state = useBuilder(() =>
    makeAutoObservable({
      traceFilterOptions: {} as TraceFilterT,
      isTraceFilterEnabled: false,
      setTraceFilterOptions(options: TraceFilterT) {
        this.traceFilterOptions = options;
      },
      setIsTraceFilterEnabled(enabled: boolean) {
        this.isTraceFilterEnabled = enabled;
      },
    })
  );

  const getContext = () =>
    createGetProps({
      traceFilterOptions: () => state.traceFilterOptions,
      isTraceFilterEnabled: () => state.isTraceFilterEnabled,
      setTraceFilterOptions: () => state.setTraceFilterOptions.bind(state),
      setIsTraceFilterEnabled: () => state.setIsTraceFilterEnabled.bind(state),
    });

  return (
    <TraceFilterOptionsContext.Provider value={getContext()}>
      {props.children}
    </TraceFilterOptionsContext.Provider>
  );
});
