import { add, NotNumberError } from 'dummy';

describe('dummy', () => {
  test('add', () => {
    const a = 1;
    const b = 5;
    expect(add(a, b)).toEqual(a + b);
  });

  test('fail', () => {
    expect(() => add(NaN, 4)).toThrowType(NotNumberError);
  });

  test('jest-extended works', () => {
    expect(Math.random()).toBeWithin(0, 1);
  });
});
