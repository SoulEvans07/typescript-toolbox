import { IRequest, ResponseBody, QueryParams, RequestHeaders, RequestBody } from 'services/request/types';

export abstract class ApiManagerBase {
  protected abstract request: IRequest;
  protected abstract get baseUrl(): string;

  protected async get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders) {
    return this.request.get<R>(url, query, this.mergeHeaders(headers));
  }

  protected async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return this.request.post<R>(url, body, this.mergeHeaders(headers));
  }

  protected async patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return this.request.patch<R>(url, body, this.mergeHeaders(headers));
  }

  protected async delete<R extends ResponseBody>(url: string, headers?: RequestHeaders): Promise<R> {
    return this.request.delete<R>(url, undefined, this.mergeHeaders(headers));
  }

  private commonHeaders: RequestHeaders = {};
  protected setHeader(name: string, value: string): void {
    this.commonHeaders[name] = value;
  }

  private mergeHeaders(headers?: RequestHeaders): RequestHeaders {
    return { ...this.commonHeaders, ...headers };
  }
}
