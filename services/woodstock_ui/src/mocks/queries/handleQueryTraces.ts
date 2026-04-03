import { http, HttpResponse } from 'msw';
import { hostUrl } from '/src/api/restClient';
import { queryTracesUrl } from '/src/api/queries/useQueryTraces';
import { convertDataToSnakeCase } from '/src/api/utils/convertDataToSnakeCase';
import { TraceListSchema } from '/src/api/types/TraceListSchema';
import { joinUrls } from '/src/utils/urls';

// Realistic mock trace data based on woodstock server format
const mockTraces = [
  {
    traceKey: 'job-123/calc-456/calculation_started',
    traceState: 'ok',
    author: 'alice',
    timestamp: '2025-04-03T10:00:00.000Z',
    payload: {
      'status': 'value://started',
      'input_count': 'value://42',
      'config': 'tree://s3://bucket/job-123/calc-456/config.json',
    },
    labels: {
      'job-123/calc-456/calculation_started': {
        'priority': 'high',
        'team': 'data-science',
      },
    },
  },
  {
    traceKey: 'job-123/calc-456/calculation_completed',
    traceState: 'ok',
    author: 'alice',
    timestamp: '2025-04-03T10:05:00.000Z',
    payload: {
      'status': 'value://completed',
      'duration_sec': 'value://300',
      'result': 'tree://s3://bucket/job-123/calc-456/result.json',
      'retry_of': 'ref://job-121/calc-456',
    },
    labels: {},
  },
  {
    traceKey: 'job-123/validation/validation_failed',
    traceState: 'error',
    author: 'bob',
    timestamp: '2025-04-03T10:06:00.000Z',
    payload: {
      'status': 'value://failed',
      'error': 'value://Invalid input format',
      'blocked_by': 'ref://job-123/calc-soc',
      'docs': 'link://https://docs.example.com/validation',
    },
    labels: {
      'job-123/validation/validation_failed': {
        'severity': 'critical',
      },
    },
  },
  {
    traceKey: 'job-124/preprocessing/data_loaded',
    traceState: 'ok',
    author: 'charlie',
    timestamp: '2025-04-03T09:00:00.000Z',
    payload: {
      'status': 'value://loaded',
      'rows': 'value://1000',
      'source': 'link://https://data.example.com/dataset-1',
    },
    labels: {},
  },
  {
    traceKey: 'job-124/preprocessing/data_cleaned',
    traceState: 'warning',
    author: 'charlie',
    timestamp: '2025-04-03T09:15:00.000Z',
    payload: {
      'status': 'value://cleaned',
      'removed_rows': 'value://50',
      'warning': 'value://High number of null values detected',
    },
    labels: {},
  },
  {
    traceKey: 'job-125/deploy/deployment_started',
    traceState: 'ok',
    author: 'diana',
    timestamp: '2025-04-03T11:00:00.000Z',
    payload: {
      'status': 'value://deploying',
      'version': 'value://1.2.3',
      'environment': 'value://production',
    },
    labels: {
      'job-125/deploy/deployment_started': {
        'release_type': 'major',
      },
    },
  },
];

export const handleQueryTraces = http.get(
  joinUrls(hostUrl, queryTracesUrl),
  ({ request }) => {
    const url = new URL(request.url);
    const traceKeyPrefix = url.searchParams.get('trace_key_prefix');
    const traceState = url.searchParams.get('trace_state');
    const author = url.searchParams.get('author');
    const timeRangeStart = url.searchParams.get('time_range_start');
    const timeRangeEnd = url.searchParams.get('time_range_end');

    // Filter traces based on query parameters
    let filteredTraces = [...mockTraces];

    if (traceKeyPrefix) {
      filteredTraces = filteredTraces.filter((trace) =>
        trace.traceKey.startsWith(traceKeyPrefix)
      );
    }

    if (traceState) {
      filteredTraces = filteredTraces.filter(
        (trace) => trace.traceState === traceState
      );
    }

    if (author) {
      filteredTraces = filteredTraces.filter(
        (trace) => trace.author === author
      );
    }

    if (timeRangeStart) {
      filteredTraces = filteredTraces.filter(
        (trace) => trace.timestamp >= timeRangeStart
      );
    }

    if (timeRangeEnd) {
      filteredTraces = filteredTraces.filter(
        (trace) => trace.timestamp <= timeRangeEnd
      );
    }

    return HttpResponse.json(
      convertDataToSnakeCase(TraceListSchema, {
        items: filteredTraces,
      })
    );
  }
);
