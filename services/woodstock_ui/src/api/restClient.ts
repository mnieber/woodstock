import axios from 'axios';

axios.defaults.withCredentials = true;

export const hostUrl = window.location.host.startsWith('localhost')
  ? import.meta.env.VITE_LOCALHOST_API_ENDPOINT ?? 'http://localhost:8080'
  : import.meta.env.VITE_BACKEND_API_ENDPOINT ?? '';

export function get(query: string) {
  return axios
    .get(`${hostUrl}${trimLeadingSlash(query)}`, {
      headers: getHeaders(),
    })
    .then((response) => {
      return response;
    });
}

export function post(query: string, variables: any, headers?: any) {
  const allHeaders = {
    ...getHeaders(),
    ...(headers ?? {}),
  };

  return axios
    .post(`${hostUrl}${trimLeadingSlash(query)}`, variables, {
      headers: allHeaders,
    })
    .then((response) => {
      return response;
    });
}

function getHeaders() {
  return {};
}

function trimLeadingSlash(query: string) {
  if (query.startsWith('/') && hostUrl.endsWith('/')) {
    query = query.substring(1);
  }
  return query;
}
