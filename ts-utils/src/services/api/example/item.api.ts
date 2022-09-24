import { Identifiable } from 'types/common';
import { retries } from '../decorators';
import { ExampleApiManagerBase } from './example.base';

export class ItemApiManager extends ExampleApiManagerBase {
  protected resourceName = 'item';

  @retries(3)
  public async getItem(id: ExampleItemDto['id']) {
    return this.get<ExampleItemDto>(this.baseUrl + '/' + id);
  }

  @retries(3)
  public async getList() {
    return this.get<ExampleItemDto[]>(this.baseUrl);
  }

  @retries(3)
  public async createItem(item: CreateExampleItemDto) {
    return this.post<ExampleItemDto>(this.baseUrl, item);
  }

  @retries(3)
  public async patchItem(item: ExampleItemDto) {
    return this.patch<ExampleItemDto>(this.baseUrl + '/' + item.id);
  }

  @retries(3)
  public async updateItem(item: ExampleItemDto) {
    return this.put<ExampleItemDto>(this.baseUrl + '/' + item.id);
  }

  @retries(3)
  public async deleteTest(id: ExampleItemDto['id']) {
    return this.delete<void>(this.baseUrl + '/' + id);
  }
}

export interface ExampleItemDto extends Identifiable {
  name: string;
}

export type CreateExampleItemDto = Omit<ExampleItemDto, 'id'>;
