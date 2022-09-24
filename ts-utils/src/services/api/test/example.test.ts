import { ApiServices } from '../index';

describe.skip('Example:api', () => {
  test('.test', () => {
    ApiServices.example.apis.item.getItem('sfa');
  });
});
