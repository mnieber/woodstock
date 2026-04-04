import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'wouter';
import { TraceExplorerView } from '/src/traces/components/TraceExplorerView';
import { TraceDetailView } from '/src/traces/components/TraceDetailView';
import { tracesRoutes } from '/src/traces/routes';
import { SelectTraceEffect } from '/src/traces/components/SelectTraceEffect';

type PropsT = {};

export const TracesSwitch = observer((props: PropsT) => {
  return (
    <Switch>
      <Route path={tracesRoutes.traces()}>
        <TraceExplorerView />
      </Route>
      <Route path={tracesRoutes.traceDetail()}>
        <SelectTraceEffect />
        <TraceDetailView />
      </Route>
    </Switch>
  );
});
