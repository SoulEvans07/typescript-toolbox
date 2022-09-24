import { IRequest, QueryParams, RequestBody, RequestHeaders, ResponseBody } from 'services/request/types';
import { ApiManagerBase } from '../api.base';
import { headers } from '../types';
import { Tokens } from './types';

export abstract class ExampleApiManagerBase extends ApiManagerBase {
  public constructor(protected request: IRequest) {
    super();
  }

  protected version = 'v1';
  protected abstract resourceName: string;
  protected get baseUrl(): string {
    return `http://typescript-utils-example.com/api/${this.version}/${this.resourceName}`;
  }

  protected async get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders) {
    return this.handleError(() => super.get<R>(url, query, headers));
  }

  protected async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders) {
    return this.handleError(() => super.post<R>(url, body, headers));
  }

  protected async patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders) {
    return this.handleError(() => super.patch<R>(url, body, headers));
  }

  protected async put<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders) {
    return this.handleError(() => super.put<R>(url, body, headers));
  }

  protected async delete<R extends ResponseBody>(url: string, headers?: RequestHeaders) {
    return this.handleError(() => super.delete<R>(url, headers));
  }

  protected async handleError<R>(apiMethod: () => Promise<R>): Promise<R> {
    return apiMethod();
    // try {
    //   return await apiMethod();
    // } catch (e) {
    //   const error = e as Error;
    //   if (!('response' in error)) throw error;

    //   if (error.response.status === 401) throw new UnauthorizedError();
    //   if (isBackendErrorData(error.response.data)) throw new BackendError(error.response.data, error);

    //   throw error;
    // }
  }

  private _tokens: Tokens | undefined;

  public setAccessToken(tokens: Tokens) {
    this._tokens = tokens;
    this.setHeader(headers.authorization, `Bearer: ${tokens.access}`);
  }

  public get tokens() {
    return this._tokens;
  }

  public clearTokens() {
    this._tokens = undefined;
  }
}
