export type QueryParams = Record<string, string | number | boolean | undefined | null>;
export type RequestHeaders = Record<string, string>;

// If you don't want to use any, change it to unknown,
// but then you can only use type to satisfy the constraints
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestBody = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResponseBody = Record<string, any> | void;

export interface IRequest {
  get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R>;
  post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  put<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  delete<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
}
