import { setupWorker } from 'msw/browser';
import { handleQueryTraces } from '/src/mocks/queries/handleQueryTraces';
import { handleFetchBlob } from '/src/mocks/queries/handleFetchBlob';
import { passthroughHandlers } from './defaultPassthrough';

export const handlers = [
  handleQueryTraces,
  handleFetchBlob,
  ...passthroughHandlers,
];

export const worker = setupWorker(...handlers);
