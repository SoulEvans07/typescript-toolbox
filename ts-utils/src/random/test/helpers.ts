import { PRNGCtor, ValueGenerator } from './types';

export function testConsistency<T>(seed: string, ctor: PRNGCtor, generator: ValueGenerator<T>) {
  return () => {
    const testCount = 100;

    const randomOne = ctor(seed);
    const resultsOne = generator(randomOne, testCount);

    const randomTwo = ctor(seed);
    const resultsTwo = generator(randomTwo, testCount);

    expect(resultsOne).toStrictEqual(resultsTwo);
  };
}
