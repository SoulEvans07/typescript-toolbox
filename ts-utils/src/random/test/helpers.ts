import { DistributionMap, PRNGCtor, RangedNumberGenerator, ValueListGenerator } from './types';

export function testConsistency<T>(seed: string, ctor: PRNGCtor, generator: ValueListGenerator<T>) {
  return () => {
    const testCount = 100;

    const randomOne = ctor(seed);
    const resultsOne = generator(randomOne, testCount);

    const randomTwo = ctor(seed);
    const resultsTwo = generator(randomTwo, testCount);

    expect(resultsOne).toStrictEqual(resultsTwo);
  };
}

export function testLinearDistribution([min, max]: [number, number], generator: RangedNumberGenerator) {
  return () => {
    const distinctCount = Math.abs(max - min);
    const testCount = Math.abs(max - min) ** 3;
    const avgValue = testCount / distinctCount;
    const epsilon = 0.05;

    const distribution = emptyDistributionMap(min, max, true);
    for (let i = 0; i < testCount; i++) {
      const value = generator(min, max);
      distribution[value] += 1;
    }

    const minValue = Math.min(...Object.values(distribution));
    const minDiff = Math.abs(minValue - avgValue);
    expect(minDiff).toBeLessThanOrEqual(avgValue * epsilon);

    const maxValue = Math.max(...Object.values(distribution));
    const maxDiff = Math.abs(maxValue - avgValue);
    expect(maxDiff).toBeLessThanOrEqual(avgValue * epsilon);
  };
}

export function emptyDistributionMap(min: number, max: number, inclusive: boolean = false): DistributionMap {
  const offset = inclusive ? 1 : 0;
  return Array<number>(Math.abs(max - min + offset))
    .fill(0)
    .reduce((acc, _, index) => ({ ...acc, [min + index]: 0 }), {} as DistributionMap);
}
