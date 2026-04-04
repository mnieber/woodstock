import { observer } from 'mobx-react-lite';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { withContextProps } from 'react-props-from-context';
import { Route } from 'wouter';
import { appCtx } from '/src/app/hooks/useAppContext';
import { TraceDetailView } from '/src/traces/components/TraceDetailView';
import { TraceListItems } from '/src/traces/components/TraceListItems';
import { tracesRoutes } from '/src/traces/routes';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  appState: appCtx.appState,
};

export const TraceExplorerView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const isDesktop = props.appState.isDesktop;

    return (
      <div className={cn('TraceExplorerView h-full', props.className)}>
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
    );
  }, ContextProps)
);
