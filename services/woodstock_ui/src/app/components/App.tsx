import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as R from 'ramda';
import { queryClient } from '/src/api/queryClient';
import { L } from '/src/frames/layout';
import { cn } from '/src/utils/classnames';
import { TracesStateProvider } from '/src/traces/components/TracesStateProvider';
import { TracesSwitch } from '/src/traces/components/TracesSwitch';
import { ScreenPropertiesEffect } from '/src/app/components/ScreenPropertiesEffect';
import { AppStateProvider } from '/src/app/components/AppStateProvider';
import { TraceTreeStateProvider } from '/src/traces/components/TraceTreeStateProvider';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <TracesStateProvider>
          <TraceTreeStateProvider>
            <AppBody>
              <ScreenPropertiesEffect />
              <TracesSwitch />
            </AppBody>
          </TraceTreeStateProvider>
        </TracesStateProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
};

const AppBody = (props: React.PropsWithChildren<{}>) => {
  return (
    <div
      id="App"
      className={cn('App', [
        R.values({
          root: L.col.banner(),
          // 320px = breakpoints.xs
          size: `min-width-[320px] h-screen w-full`,
          scroll: 'overflow-x-hidden',
        }),
      ])}
      tabIndex={0}
      ref={(x: any) => x?.focus()}
    >
      {props.children}
    </div>
  );
};
