import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'wouter';
import { TracesListView } from '/src/traces/components/TracesListView';
import { tracesRoutes } from '/src/traces/routes';

type PropsT = {};

export const TracesSwitch = observer((props: PropsT) => {
  return (
    <Switch>
      <Route path={tracesRoutes.traces()}>
        <TracesListView />
      </Route>
      <Route path={tracesRoutes.traceDetail()}>
        <TracesListView />
      </Route>
    </Switch>
  );
});
