import { InvalidArgumentException } from 'polyfills/number/types';

describe('Number:polyfill', () => {
  describe.each<PadTestCase>([
    { title: 'value.pad()', padNumber: (value, length, char) => value.pad(length, char) },
    { title: 'Number.pad(value)', padNumber: (value, length, char) => Number.pad(value, length, char) },
  ])('.pad()', variant => {
    describe(variant.title, () => {
      testPadVariants(variant.padNumber, 12, 5);
    });

    function testPadVariants(padNumber: PadTestCase['padNumber'], val: number, len: number) {
      describe('default char', () => {
        const padded = padNumber(val, len);
        testPadValue(padded, val, len, '0');
      });

      describe('# char', () => {
        const char = '#';
        const padded = padNumber(val, len, char);
        testPadValue(padded, val, len, char);
      });
    }

    function testPadValue(padded: string, val: number, len: number, char: string) {
      test('value', () => {
        expect(padded).toHaveLength(len);
      });

      test('start', () => {
        expect(padded).toStartWith(''.padStart(len - String(val).length, char));
      });

      test('end', () => {
        expect(padded).toEndWith(String(val));
      });
    }
  });

  describe('.range()', () => {
    describe('(max)', () => {
      test('max < 0', () => {
        expect(() => Number.range(-10)).toThrowType(InvalidArgumentException);
      });

      test('max = 0', () => {
        expect(() => Number.range(0)).toThrowType(InvalidArgumentException);
      });

      test('max > 0', () => {
        const range = Number.range(5);
        expect(range).toStrictEqual([0, 1, 2, 3, 4]);
      });
    });

    describe('(min, max)', () => {
      test('max < min', () => {
        expect(() => Number.range(0, -5)).toThrowType(InvalidArgumentException);
        expect(() => Number.range(5, -5)).toThrowType(InvalidArgumentException);
      });

      test('max = min', () => {
        expect(() => Number.range(-5, -5)).toThrowType(InvalidArgumentException);
        expect(() => Number.range(0, 0)).toThrowType(InvalidArgumentException);
        expect(() => Number.range(5, 5)).toThrowType(InvalidArgumentException);
      });

      test('max > min', () => {
        const range = Number.range(5);
        expect(range).toStrictEqual([0, 1, 2, 3, 4]);

        expect(Number.range(-5, 0)).toStrictEqual([-5, -4, -3, -2, -1]);
        expect(Number.range(-5, 5)).toStrictEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
        expect(Number.range(0, 5)).toStrictEqual([0, 1, 2, 3, 4]);
      });
    });

    describe('(max, { step })', () => {
      testRangeStep((max: number, step: number) => Number.range(max, { step }));
    });

    describe('(min, max, { step })', () => {
      testRangeStep((max: number, step: number) => Number.range(0, max, { step }));
    });

    function testRangeStep(generator: (max: number, step: number) => number[]) {
      test('step < 0', () => {
        expect(() => generator(5, -1)).toThrowType(InvalidArgumentException);
      });

      test('step = 0', () => {
        expect(() => generator(5, 0)).toThrowType(InvalidArgumentException);
      });

      test('step >= max - min', () => {
        expect(() => generator(5, 5)).toThrowType(InvalidArgumentException);
      });

      test('step > 0', () => {
        expect(generator(10, 3)).toStrictEqual([0, 3, 6, 9]);
      });
    }

    describe.each<RangeIncTestCase>([
      { min: 0, max: 5, step: 1, expected: [0, 1, 2, 3, 4, 5] },
      { min: 0, max: 6, step: 2, expected: [0, 2, 4, 6] },
      { min: 0, max: 7, step: 2, expected: [0, 2, 4, 6] },
      { min: -5, max: 5, step: 1, expected: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] },
      { min: -5, max: 7, step: 2, expected: [-5, -3, -1, 1, 3, 5, 7] },
      { min: -5, max: 8, step: 2, expected: [-5, -3, -1, 1, 3, 5, 7] },
    ])('(min, max, { inc: true })', ({ min, max, step, expected }) => {
      test(`[${min}, ${max}] step: ${step}`, () => {
        expect(Number.range(min, max, { step, inc: true })).toStrictEqual(expected);
      });
    });
  });
});

interface PadTestCase {
  title: string;
  padNumber: (value: number, length: number, char?: string) => string;
}

interface RangeIncTestCase {
  min: number;
  max: number;
  step: number;
  expected: number[];
}
