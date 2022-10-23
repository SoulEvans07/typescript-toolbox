import { QueryParams } from './types';

export function withQuery(url: string, query?: QueryParams): string {
  if (query === undefined) return url;

  const keyPairs = Object.entries(query).filter(([, value]) => value !== undefined);
  if (keyPairs.length === 0) return url;

  const fullUrl = new URL(url);
  keyPairs.forEach(([key, value]) => fullUrl.searchParams.append(key, String(value)));

  return fullUrl.toString();
}
