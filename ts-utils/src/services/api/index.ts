import { request } from 'services/request';
import { ExampleApiManager } from './example.api';

export const ApiServices = {
  example: new ExampleApiManager(request),

  setAuthToken(token: string) {
    Object.values(this.fromProperties()).forEach(api => api.setAuthToken(token));
  },
} as const;
