import { http, passthrough } from 'msw';
import { hostUrl } from '/src/api/restClient';

export const woodstockServer = http.get(`${hostUrl}*`, () => {
  return passthrough();
});

export const fonts = http.get('/fonts/*', () => {
  return passthrough();
});

export const src = http.get('/src/*', () => {
  return passthrough();
});

export const passthroughHandlers = [woodstockServer, fonts, src];
