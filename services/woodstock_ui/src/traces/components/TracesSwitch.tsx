import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'wouter';
import { TraceExplorerView } from '/src/traces/components/TraceExplorerView';
import { tracesRoutes } from '/src/traces/routes';
import { SelectTraceEffect } from '/src/traces/components/SelectTraceEffect';
import { ext } from '/src/routes/navHandler';

type PropsT = {};

export const TracesSwitch = observer((props: PropsT) => {
  return (
    <Switch>
      <Route path={ext(tracesRoutes.traces())}>
        <TraceExplorerView />
        <Route path={tracesRoutes.trace()}>
          <SelectTraceEffect />
        </Route>
      </Route>
    </Switch>
  );
});
