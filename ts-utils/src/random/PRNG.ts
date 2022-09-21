import { NumberGenerator, PRNGInitializer } from './types';
import { sfc32 } from './prng/sfc32';
import { cyrb128 } from './seed/cyrb128';

export class PRNG {
  private number: NumberGenerator; // range: [0, 1)

  constructor(seed: string = randomSeed(), initializer: PRNGInitializer = sfc32_cyrb128) {
    this.number = initializer(seed);
  }

  // range: [min, max)
  float(max?: number): number;
  float(min: number, max: number): number;
  float(val1: number = 1, val2?: number): number {
    const min = val2 === undefined ? 0 : val1;
    const max = val2 === undefined ? val1 : val2;
    return min + this.number() * (max - min);
  }

  // range: [min, max]
  integer(max?: number): number;
  integer(min: number, max: number): number;
  integer(val1: number = 1, val2?: number): number {
    const min = val2 === undefined ? 0 : val1;
    const max = val2 === undefined ? val1 : val2;
    return min + Math.floor(this.float() * (max - min + 1));
  }

  shuffle<T>(array: T[]) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.integer(i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

function randomSeed(): string {
  const size = Number.MAX_SAFE_INTEGER;
  const number = Math.floor(Math.random() * size);
  return String(number);
}

function sfc32_cyrb128(seed: string): NumberGenerator {
  const hashSeed = cyrb128(seed);
  return sfc32(...hashSeed);
}
