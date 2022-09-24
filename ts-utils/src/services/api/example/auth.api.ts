import { Identifiable } from 'types/common';
import { MissingTokenError } from 'services/request/errorTypes';
import { ExampleApiManagerBase } from './example.base';

export class AuthApiManager extends ExampleApiManagerBase {
  protected resourceName = 'item';

  public async login(username: string, password: string) {
    return this.post<AuthResponseDto>(this.baseUrl + '/auth/login', { username, password });
  }

  public async refreshToken() {
    if (!this.tokens) throw new MissingTokenError();
    return this.post<AuthResponseDto>(this.baseUrl + '/auth/refresh', { refreshToken: this.tokens.refresh });
  }

  public logout() {
    return this.post<void>(this.baseUrl + '/auth/logout');
  }
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: ExampleUser;
}

export interface ExampleUser extends Identifiable {
  username: string;
  nickname: string;
}
