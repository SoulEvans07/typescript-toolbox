import { ApiServices } from '../index';

describe.only('Example:api', () => {
  test('.test', async () => {
    try {
      await ApiServices.example.login('adam.szi', 'Pass123!');
      const response = await ApiServices.example.apis.item.test();
      console.log('res', response);
    } catch (e) {
      console.log('error', e);
    }
  });
});
