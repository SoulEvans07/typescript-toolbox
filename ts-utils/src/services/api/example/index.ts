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

  public get apis() {
    const wrappedApis = Object.entriesTyped(this._apis).reduce((apis, [apiName, api]) => {
      const functions = this._apis[apiName].fromAllFunctions();
      const withRetries = Object.entriesTyped(functions).reduce((wrapped, [funcName, func]) => {
        const retries = getRetries(this._apis[apiName], funcName) || 0;
        if (retries === 0) return wrapped;
        return {
          ...wrapped,
          [funcName]: func,
        };
      }, {} as typeof functions);

      return {
        ...apis,
        [apiName]: { ...api, ...withRetries },
      };
    }, this._apis);

    return wrappedApis;
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
