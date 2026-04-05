import { observer } from 'mobx-react-lite';
import { isLoading } from 'mobx-resource-states';
import { withContextProps } from 'react-props-from-context';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TraceListItem } from '/src/traces/components/TraceListItem';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { tracesNav } from '/src/traces/routes';
import { LoaderBar } from '/src/frames/components/LoaderBar';
import { L } from '/src/frames/layout';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  traces: tracesCtx.traces,
  tracesSelection: tracesCtx.tracesSelection,
};

export const TraceListItems = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    if (isLoading(props.traces)) {
      return <TraceListItemsLoader className="text-gray-text" />;
    }

    const traceDivs = props.traces.map((trace: TraceRecordT) => {
      const url = tracesNav.trace({ traceKey: trace.traceKey }).url;
      return (
        <TraceListItem
          key={trace.traceKey}
          className={{
            'TraceListItem--selected': props.tracesSelection.itemIds.includes(
              trace.traceKey
            ),
          }}
          trace={trace}
          url={url}
        />
      );
    });

    return (
      <div
        className={cn('TraceListItems', ['p-6', props.className])}
        tabIndex={1}
      >
        <div className="bg-white rounded-lg shadow-sm border">{traceDivs}</div>
      </div>
    );
  }, ContextProps)
);

export const TraceListItemsLoader = (props: { className?: any }) => {
  const loaderBars = ['1', '2', '3'].map((id: string) => {
    return <LoaderBar key={`item-${id}`} className={cn('my-1 h-6')} />;
  });

  return (
    <div
      className={cn('TraceListItemsLoader', [
        L.col.banner(),
        'min-w-[50px]',
        props.className,
      ])}
    >
      {loaderBars}
    </div>
  );
};
