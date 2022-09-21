import { PRNG } from '../index';
import {
  sfc32_cyrb128,
  sfc32_xmur3,
  sfc32_xmur3a,
  mulberry32_cyrb128,
  mulberry32_xmur3,
  mulberry32_xmur3a,
} from './variants';
import { PRNGVariantCase } from './types';
import { emptyDistributionMap, testConsistency, testLinearDistribution } from './helpers';
import { InvalidArgumentException } from '../errors';

describe('Random', () => {
  const variants: PRNGVariantCase[] = [
    { name: 'default' },
    { name: 'sfc32_cyrb128', initializer: sfc32_cyrb128, skip: true },
    { name: 'sfc32_xmur3', initializer: sfc32_xmur3, skip: true },
    { name: 'sfc32_xmur3a', initializer: sfc32_xmur3a, skip: true },
    { name: 'mulberry32_cyrb128', initializer: mulberry32_cyrb128, skip: true },
    { name: 'mulberry32_xmur3', initializer: mulberry32_xmur3, skip: true },
    { name: 'mulberry32_xmur3a', initializer: mulberry32_xmur3a, skip: true },
  ];

  describe.each(variants.filter(v => !v.skip))('Variants', variant => {
    const { name } = variant;
    function createPRNG(seed: string | undefined) {
      if ('initializer' in variant) return new PRNG(seed, variant.initializer);
      return new PRNG(seed);
    }

    describe(`::${name}`, () => {
      const seed = 'pseudo-random-test-seed';
      const PseudoRandom = createPRNG(seed);
      const Random = createPRNG(undefined);

      describe('.float()', () => {
        const [min, max] = [-100, 100];

        test(
          'is consistent',
          testConsistency('float-consistent', createPRNG, (r, c) => {
            return new Array(c).fill(null).map(() => r.float(min, max));
          })
        );

        describe('method overloads', () => {
          const testCount = 100;

          test('() => [0, 1)', () => {
            for (let i = 0; i < testCount; i++) {
              const value = Random.float();
              expect(value).toBeGreaterThanOrEqual(0);
              expect(value).toBeLessThan(1);
            }
          });

          test('(max) => [0, max)', () => {
            for (let i = 0; i < testCount; i++) {
              const value = Random.float(max);
              expect(value).toBeGreaterThanOrEqual(0);
              expect(value).toBeLessThan(max);
            }
          });

          test('(min, max) => [min, max)', () => {
            for (let i = 0; i < testCount; i++) {
              const value = Random.float(min, max);
              expect(value).toBeGreaterThanOrEqual(min);
              expect(value).toBeLessThan(max);
            }
          });
        });

        // TODO: needs fixing @adam.szi
        test.skip(
          `distribution [${min}, ${max})`,
          testLinearDistribution([min, max], (min, max) => Math.round(Random.float(min, max)))
        );
      });

      describe('.integer()', () => {
        const [min, max] = [-100, 100];

        test(
          'is consistent',
          testConsistency('integer-consistent', createPRNG, (r, c) => {
            return new Array(c).fill(null).map(() => r.integer(min, max));
          })
        );

        describe('method overloads', () => {
          const testCount = 100;

          test('() => [0, 1]', () => {
            for (let i = 0; i < testCount; i++) {
              const value = Random.integer();
              expect(value).toBeInteger();
              expect(value).toBeGreaterThanOrEqual(0);
              expect(value).toBeLessThanOrEqual(1);
            }
          });

          test('(max) => [0, max]', () => {
            for (let i = 0; i < testCount; i++) {
              const value = Random.integer(max);
              expect(value).toBeGreaterThanOrEqual(0);
              expect(value).toBeLessThanOrEqual(max);
            }
          });

          test('(min, max) => [min, max]', () => {
            for (let i = 0; i < testCount; i++) {
              const value = Random.integer(min, max);
              expect(value).toBeGreaterThanOrEqual(min);
              expect(value).toBeLessThanOrEqual(max);
            }
          });
        });

        test.skip(
          `distribution [${min}, ${max}]`,
          testLinearDistribution([min, max], (min, max) => Random.integer(min, max))
        );
      });

      describe('.shuffle()', () => {
        test(
          'is consistent',
          testConsistency('shuffle-consistent', createPRNG, (r, c) => {
            const array = new Array(c).fill(null).map((_, i) => i);
            return r.shuffle(array);
          })
        );

        test('returns values from array', () => {
          const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
          for (let i = 0; i < array.length ** 2; i++) {
            const shuffled = Random.shuffle(array);
            expect(array).toContainAllValues(shuffled);
          }
        });
      });

      describe('.choose()', () => {
        const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        test(
          'is consistent',
          testConsistency('choose-consistent', createPRNG, (r, c) => {
            const array = new Array(c).fill(null).map((_, i) => i);
            return r.choose(array, Math.ceil(c / 2));
          })
        );

        test('error is thrown when count < 1', () => {
          expect(() => Random.choose([0, 1, 2, 3], 0)).toThrowType(InvalidArgumentException);
          expect(() => Random.choose([0, 1, 2, 3], -10)).toThrowType(InvalidArgumentException);
        });

        test('(array: T[]) => T', () => {
          const value = Random.choose(array);
          expect(value).not.toBeArray();
        });

        test('(array: T[], count: number) => T[]', () => {
          const value = Random.choose(array, 2);
          expect(value).toBeArray();
        });

        test('returns values from array', () => {
          for (let i = 0; i < array.length ** 2; i++) {
            const value = Random.choose(array);
            expect(array).toContain(value);
          }

          for (let i = 0; i < array.length ** 2; i++) {
            const values = Random.choose(array, Math.ceil(array.length / 2));
            expect(array).toContainValues(values);
          }
        });
      });
    });
  });
});
