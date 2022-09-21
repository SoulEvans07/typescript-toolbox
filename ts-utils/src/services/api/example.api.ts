import { IRequest } from 'services/request/types';
import { ApiManagerBase } from './api.base';

export class ExampleApiManager extends ApiManagerBase {
  public constructor(protected request: IRequest) {
    super();
  }

  protected get baseUrl(): string {
    return 'http://example-api.com';
  }

  public setAuthToken(token: string) {
    this.setHeader('Authorization', `Bearer: ${token}`);
  }
}
