import { PRNG } from '../PRNG';
import { PRNGInitializer } from '../types';

interface DefaultCase {
  name: 'default';
}

interface VariantCase {
  name: string;
  initializer: PRNGInitializer;
}

export type PRNGVariantCase = DefaultCase | VariantCase;

export type PRNGCtor = (seed: string | undefined) => PRNG;
export type ValueListGenerator<T> = (prng: PRNG, count: number) => T[];

export type DistributionMap = Record<number, number>;
export type RangedNumberGenerator = (min: number, max: number) => number;
