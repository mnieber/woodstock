import { history } from '/src/routes/history';
import { navHandler, RouteSpecT } from '/src/routes/navHandler';
import { generatePath } from '/src/routes/utils/generatePath';

export const tracesRoutes = {
  traces: () => '/traces',
  trace: () => '/traces/*',
};

export class TracesNav {
  traces(params: {}, callerId?: string): RouteSpecT {
    return navHandler().run('traces', params, callerId);
  }
  trace(params: { traceKey: string }, callerId?: string): RouteSpecT {
    return navHandler().run('trace', params, callerId);
  }
}

export class DefaultTracesNavHandler extends TracesNav {
  traces(params: {}, callerId?: string) {
    return {
      url: generatePath(tracesRoutes.traces(), params),
      nav: history.push,
    };
  }

  trace(params: { traceKey: string }, callerId?: string) {
    return {
      url: `/traces/${params.traceKey}`,
      nav: history.push,
    };
  }
}

export const tracesNav = new TracesNav();
