import { Cbs } from 'aspiration';
import * as R from 'ramda';
import { mapDataToProps } from 'skandha';
import { Selection, handleSelectItem } from 'skandha-facets';
import { registerCtr } from 'skandha-mobx';
import { TracesState } from '/src/traces/TracesState/TracesState';

const mapData = (state: TracesState) => {
  const ctr = state.tracesCtr;
  const getTraceByKey = (key: string) => ctr.data.traceByKey[key];

  mapDataToProps(ctr, {
    data: {
      traces: () => state.props.getTraces(),
    },
    highlight: {
      item: () =>
        ctr.highlight.itemId ? getTraceByKey(ctr.highlight.itemId) : undefined,
    },
    selection: {
      selectableIds: () => R.map(R.prop('traceKey'), ctr.data.traces),
      items: () =>
        R.filter(
          (x: any) => x !== undefined,
          R.map(getTraceByKey, ctr.selection.itemIds)
        ),
    },
  });
};

const setCallbacks = (state: TracesState) => {
  const ctr = state.tracesCtr;

  ctr.selection.callbackMap = {
    selectItem: {
      selectItem(this: Cbs<Selection['selectItem']>) {
        handleSelectItem(ctr.selection, this.args);
        if (!this.args.isCtrl && !this.args.isShift) {
          ctr.highlight.set({ itemId: this.args.itemId });
        }
      },
    },
  };
};

export const registerTracesCtr = (state: TracesState) => {
  registerCtr({
    ctr: state.tracesCtr,
    options: { name: 'TracesState.Traces' },
    initCtr: () => {
      mapData(state);
      setCallbacks(state);
    },
  });
};
