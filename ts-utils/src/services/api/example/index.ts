import { IRequest } from 'services/request/types';
import { Tokens } from './types';
import { AuthApiManager } from './auth.api';
import { ItemApiManager } from './item.api';

interface ExampleApis {
  auth: AuthApiManager;
  item: ItemApiManager;
}

export class ExampleApiServices {
  public apis: ExampleApis;
  public constructor(request: IRequest) {
    this.apis = {
      auth: new AuthApiManager(request),
      item: new ItemApiManager(request, this.handleAuthError.bind(this)),
    };
  }

  public async login(username: string, password: string) {
    const { user, accessToken, refreshToken } = await this.apis.auth.login(username, password);
    Object.values(this.apis).forEach(api =>
      api.setAccessToken({
        access: accessToken,
        refresh: refreshToken,
      })
    );
    return user;
  }

  public async refreshToken() {
    const { user, accessToken, refreshToken } = await this.apis.auth.refreshToken();
    Object.values(this.apis).forEach(api =>
      api.setAccessToken({
        access: accessToken,
        refresh: refreshToken,
      })
    );
    return user;
  }

  public async logout() {
    await this.apis.auth.logout();
    Object.values(this.apis).forEach(api => api.clearTokens());
  }

  public setAuthToken(tokens: Tokens) {
    Object.values(this.apis).forEach(api => api.setAccessToken(tokens));
  }

  private async handleAuthError() {
    console.log('try refresh token');
    await this.apis.auth.refreshToken();
  }
}
