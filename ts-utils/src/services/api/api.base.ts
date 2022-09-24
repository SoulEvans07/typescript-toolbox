import { Exception } from 'types/error';
import { StatusCode } from 'services/request/statusCodes';
import { IRequest, ResponseBody, QueryParams, RequestHeaders, RequestBody } from 'services/request/types';
import { AsyncCallback, ErrorHandler } from './types';

export abstract class ApiManagerBase {
  protected abstract request: IRequest;
  protected abstract get baseUrl(): string;

  protected async get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders) {
    return handleErrors(() => this.request.get<R>(url, query, this.mergeHeaders(headers)));
  }

  protected async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return handleErrors(() => this.request.post<R>(url, body, this.mergeHeaders(headers)));
  }

  protected async patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return handleErrors(() => this.request.patch<R>(url, body, this.mergeHeaders(headers)));
  }

  protected async put<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return handleErrors(() => this.request.put<R>(url, body, this.mergeHeaders(headers)));
  }

  protected async delete<R extends ResponseBody>(url: string, headers?: RequestHeaders): Promise<R> {
    return handleErrors(() => this.request.delete<R>(url, undefined, this.mergeHeaders(headers)));
  }

  private commonHeaders: RequestHeaders = {};
  protected setHeader(name: string, value: string): void {
    this.commonHeaders[name] = value;
  }

  private mergeHeaders(headers?: RequestHeaders): RequestHeaders {
    return { ...this.commonHeaders, ...headers };
  }

async function handleErrors<R>(apiMethod: () => Promise<R>): Promise<R> {
async function handleErrors<R>(apiMethod: AsyncCallback<R>): Promise<R> {
  try {
    return await apiMethod();
  } catch (e) {
    const error = Exception.from(e);
    if (error.is(ResponseError) && error.status === StatusCode.Unauthorized) throw new UnauthorizedError();
    throw error;
  }
}
