import { Exception } from 'types/error';

export const headers = {
  acceptLanguage: 'Accept-Language',
  authorization: 'Authorization',
} as const;

export type AsyncCallback<T> = () => Promise<T>;
export type ErrorHandler = (e: Exception) => Promise<void>;
