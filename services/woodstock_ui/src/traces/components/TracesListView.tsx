import { observer } from 'mobx-react-lite';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Route } from 'wouter';
import { SelectTraceEffect } from '/src/traces/components/SelectTraceEffect';
import { TraceDetailView } from '/src/traces/components/TraceDetailView';
import { TraceListItems } from '/src/traces/components/TraceListItems';
import { tracesRoutes } from '/src/traces/routes';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

export const TracesListView = observer((props: PropsT) => {
  const [isDesktop, setIsDesktop] = React.useState(
    window.matchMedia('(min-width: 1024px)').matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return (
    <>
      <SelectTraceEffect />
      <div className={cn('TracesListView h-full', props.className)}>
        {isDesktop ? (
          // Desktop: Split view with resizable panels
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full overflow-y-auto border-r border-gray-200">
                <TraceListItems />
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
            <Panel defaultSize={60} minSize={40}>
              <div className="h-full overflow-y-auto">
                <TraceDetailView />
              </div>
            </Panel>
          </PanelGroup>
        ) : (
          // Mobile: List only, detail opens in new route
          <div className="h-full overflow-y-auto">
            <Route path={tracesRoutes.traceDetail()}>
              <TraceDetailView />
            </Route>
            <Route path={tracesRoutes.traces()}>
              <TraceListItems />
            </Route>
          </div>
        )}
      </div>
    </>
  );
});
