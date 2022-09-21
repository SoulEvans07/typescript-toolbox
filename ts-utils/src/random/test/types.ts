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
export type ValueGenerator<T> = (prng: PRNG, count: number) => T[];
