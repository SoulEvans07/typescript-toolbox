import { IRequest } from 'services/request/types';
import { Tokens } from './types';
import { AuthApiManager } from './auth.api';
import { ItemApiManager } from './item.api';
import { getRetries } from '../decorators';

interface ExampleApis {
  auth: AuthApiManager;
  item: ItemApiManager;
}

export class ExampleApiServices {
  private readonly _apis: ExampleApis;
  public constructor(request: IRequest) {
    this._apis = {
      auth: new AuthApiManager(request),
      item: new ItemApiManager(request),
    };
  }

  public async login(username: string, password: string) {
    const { user, accessToken, refreshToken } = await this._apis.auth.login(username, password);
    Object.values(this._apis).forEach(api =>
      api.setAccessToken({
        access: accessToken,
        refresh: refreshToken,
      })
    );
    return user;
  }

  public async refreshToken() {
    const { user, accessToken, refreshToken } = await this._apis.auth.refreshToken();
    Object.values(this._apis).forEach(api =>
      api.setAccessToken({
        access: accessToken,
        refresh: refreshToken,
      })
    );
    return user;
  }

  public async logout() {
    await this._apis.auth.logout();
    Object.values(this._apis).forEach(api => api.clearTokens());
  }

  public setAuthToken(tokens: Tokens) {
    Object.values(this._apis).forEach(api => api.setAccessToken(tokens));
  }
}
