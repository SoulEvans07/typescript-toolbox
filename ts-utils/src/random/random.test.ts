import { Random } from './index';

describe('Random', () => {
  describe('number', () => {
    test('size argument defaults to 1', () => {
      const value = Random.number();
      expect(value).toBeWithin(0, 1);
    });
  });
});
