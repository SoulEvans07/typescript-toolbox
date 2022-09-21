import { Random } from './index';

describe('Random', () => {
  describe('number', () => {
    test('size argument defaults to 1', () => {
      const value = Random.float();
      expect(value).toBeWithin(0, 1);
    });
  });
});
