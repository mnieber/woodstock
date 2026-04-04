import { data, operation } from 'skandha';
import { TraceFilterT } from '/src/api/types/TraceFilterT';
import { TraceStateT } from '/src/api/types/TraceStateT';

export class Filter {
  static className = () => 'Filter';

  @data traceKeyPrefix: string = '';
  @data traceState: TraceStateT | '' = '';
  @data author: string = '';
  @data timeRangeStart: string = '';
  @data timeRangeEnd: string = '';

  @operation setTraceKeyPrefix(value: string) {
    this.traceKeyPrefix = value;
  }

  @operation setTraceState(value: TraceStateT | '') {
    this.traceState = value;
  }

  @operation setAuthor(value: string) {
    this.author = value;
  }

  @operation setTimeRangeStart(value: string) {
    this.timeRangeStart = value;
  }

  @operation setTimeRangeEnd(value: string) {
    this.timeRangeEnd = value;
  }

  @operation clearAll() {
    this.traceKeyPrefix = '';
    this.traceState = '';
    this.author = '';
    this.timeRangeStart = '';
    this.timeRangeEnd = '';
  }

  get asFilterObject(): TraceFilterT {
    const filter: TraceFilterT = {};
    if (this.traceKeyPrefix) filter.traceKeyPrefix = this.traceKeyPrefix;
    if (this.traceState) filter.traceState = this.traceState;
    if (this.author) filter.author = this.author;
    if (this.timeRangeStart) filter.timeRangeStart = this.timeRangeStart;
    if (this.timeRangeEnd) filter.timeRangeEnd = this.timeRangeEnd;
    return filter;
  }
}
