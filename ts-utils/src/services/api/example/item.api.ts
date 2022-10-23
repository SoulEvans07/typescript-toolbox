import { Identifiable } from 'types/common';
import { IRequest } from 'services/request/types';
import { AsyncCallback, ErrorHandler } from '../types';
import { ExampleApiManagerBase } from './example.base';

export class ItemApiManager extends ExampleApiManagerBase {
  protected resourceName = 'item';

  constructor(request: IRequest, protected onAuthError: ErrorHandler) {
    super(request);
  }

  public async test() {
    return this.handleRetries(() => this.get('https://api.smartoffice.snapsoft.io/api/workspace/desks/1'));
  }

  public async getItem(id: ExampleItemDto['id']) {
    return this.handleRetries(() => this.get<ExampleItemDto>(this.baseUrl + '/' + id));
  }

  public async getList() {
    return this.handleRetries(() => this.get<ExampleItemDto[]>(this.baseUrl));
  }

  public async createItem(item: CreateExampleItemDto) {
    return this.handleRetries(() => this.post<ExampleItemDto>(this.baseUrl, item));
  }

  public async patchItem(item: ExampleItemDto) {
    return this.handleRetries(() => this.patch<ExampleItemDto>(this.baseUrl + '/' + item.id));
  }

  public async updateItem(item: ExampleItemDto) {
    return this.handleRetries(() => this.put<ExampleItemDto>(this.baseUrl + '/' + item.id));
  }

  public async deleteTest(id: ExampleItemDto['id']) {
    return this.handleRetries(() => this.delete<void>(this.baseUrl + '/' + id));
  }

  protected handleRetries<R>(
    apiMethod: AsyncCallback<R>,
    onAuthError = this.onAuthError,
    maxTries: number = 3,
    tryCount?: number
  ): Promise<R> {
    return super.handleRetries(apiMethod, onAuthError, maxTries, tryCount);
  }
}

export interface ExampleItemDto extends Identifiable {
  name: string;
}

export type CreateExampleItemDto = Omit<ExampleItemDto, 'id'>;
