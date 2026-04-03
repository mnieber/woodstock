import { history } from '/src/routes/history';
import { navHandler, RouteSpecT } from '/src/routes/navHandler';
import { generatePath } from '/src/routes/utils/generatePath';

export const tracesRoutes = {
  traces: () => '/traces',
  traceDetail: () => '/traces/*',
};

export class TracesNav {
  traces(params: {}, callerId?: string): RouteSpecT {
    return navHandler().run('traces', params, callerId);
  }
  traceDetail(params: { traceKey: string }, callerId?: string): RouteSpecT {
    return navHandler().run('traceDetail', params, callerId);
  }
}

export class DefaultTracesNavHandler extends TracesNav {
  traces(params: {}, callerId?: string) {
    return {
      url: generatePath(tracesRoutes.traces(), params),
      nav: history.push,
    };
  }

  traceDetail(params: { traceKey: string }, callerId?: string) {
    return {
      url: `/traces/${params.traceKey}`,
      nav: history.push,
    };
  }
}

export const tracesNav = new TracesNav();
