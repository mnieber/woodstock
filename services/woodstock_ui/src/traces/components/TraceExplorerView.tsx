import { observer } from 'mobx-react-lite';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { withContextProps } from 'react-props-from-context';
import { Route } from 'wouter';
import { appCtx } from '/src/app/hooks/useAppContext';
import { TraceDetailView } from '/src/traces/components/TraceDetailView';
import { TraceListItems } from '/src/traces/components/TraceListItems';
import { TraceTreeView } from '/src/traces/components/TraceTreeView';
import { TraceTreeStateProvider } from '/src/traces/components/TraceTreeStateProvider';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { tracesRoutes } from '/src/traces/routes';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  appState: appCtx.appState,
  viewMode: tracesCtx.viewMode,
};

export const TraceExplorerView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const isDesktop = props.appState.isDesktop;
    const viewMode = props.viewMode.mode;

    // Toggle button for switching between list and tree view
    const ViewToggle = () => (
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => props.viewMode.setMode('list')}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          )}
        >
          List
        </button>
        <button
          onClick={() => props.viewMode.setMode('tree')}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'tree'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          )}
        >
          Tree
        </button>
      </div>
    );

    const ListView = viewMode === 'list' ? <TraceListItems /> : (
      <TraceTreeStateProvider>
        <TraceTreeView />
      </TraceTreeStateProvider>
    );

    return (
      <div className={cn('TraceExplorerView h-full', props.className)}>
        {isDesktop ? (
          // Desktop: Split view with resizable panels
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full flex flex-col border-r border-gray-200">
                <ViewToggle />
                <div className="flex-1 overflow-y-auto">
                  {ListView}
                </div>
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
              <div className="h-full flex flex-col">
                <ViewToggle />
                <div className="flex-1 overflow-y-auto">
                  {ListView}
                </div>
              </div>
            </Route>
          </div>
        )}
      </div>
    );
  }, ContextProps)
);
