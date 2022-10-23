import { request } from 'services/request';
import { ExampleApiServices } from './example';

export class ApiServices {
  public static readonly example = new ExampleApiServices(request);
}
