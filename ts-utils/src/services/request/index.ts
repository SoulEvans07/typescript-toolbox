import { withQuery } from './helpers';
import { StatusCode } from './statusCodes';
import { IRequest, QueryParams, RequestBody, RequestHeaders, ResponseBody } from './types';

class Request implements IRequest {
  public async get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R> {
    return fetch(withQuery(url, query), { method: 'get', headers }).then(response => handleResponse(response));
  }

  public async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return new Promise<R>((resolve, reject) =>
      fetch(url, {
        method: 'post',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }).then(
        response => resolve(handleResponse(response)),
        err => reject(err) // fetch error, i.e: no internet
      )
    );
  }

  public async patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return new Promise<R>((resolve, reject) =>
      fetch(url, {
        method: 'PATCH', // for some reason it will only work with uppercase
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }).then(
        response => resolve(handleResponse(response)),
        err => reject(err) // fetch error, i.e: no internet
      )
    );
  }

  public async delete<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return new Promise<R>((resolve, reject) =>
      fetch(url, {
        method: 'delete',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }).then(
        response => resolve(handleResponse(response)),
        err => reject(err) // fetch error, i.e: no internet
      )
    );
  }
}

export const request: IRequest = new Request();

async function handleResponse<R extends ResponseBody>(response: Response): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    if (response.status !== StatusCode.OK) parseBody(response).then(error => reject(error));
    else parseBody(response).then(data => resolve(data));
  });
}

async function parseBody(response: Response) {
  return response.text().then(text => JSON.parse(text || '{}'));
}
