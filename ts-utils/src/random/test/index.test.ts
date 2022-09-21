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

describe('Random', () => {
  const variants: PRNGVariantCase[] = [
    { name: 'default' },
    { name: 'sfc32_cyrb128', initializer: sfc32_cyrb128 },
    { name: 'sfc32_xmur3', initializer: sfc32_xmur3 },
    { name: 'sfc32_xmur3a', initializer: sfc32_xmur3a },
    { name: 'mulberry32_cyrb128', initializer: mulberry32_cyrb128 },
    { name: 'mulberry32_xmur3', initializer: mulberry32_xmur3 },
    { name: 'mulberry32_xmur3a', initializer: mulberry32_xmur3a },
  ];

  describe.each(variants)('Variants', variant => {
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
          testConsistency('float-consistent', createPRNG, (r, c) =>
            new Array(c).fill(null).map(() => r.float(min, max))
          )
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
          testConsistency('float-consistent', createPRNG, (r, c) =>
            new Array(c).fill(null).map(() => r.integer(min, max))
          )
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
    });
  });
});
