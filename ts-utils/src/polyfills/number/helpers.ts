export function padNumber(number: number, length: number, char: string = '0'): string {
  return String(number).padStart(length, char);
}

export function parseRangeParams(
  val1: number,
  val2?: number | RangeOptions,
  val3?: RangeOptions
): [min: number, max: number, opt: Required<RangeOptions>] {
  const optThird = typeof val3 === 'object' && typeof val2 === 'number';
  const optSecond = typeof val2 === 'object';
  const hasSecond = val2 !== undefined;
  const hasThird = hasSecond && optThird;

  const min = hasSecond ? (!optSecond ? val1 : 0) : 0;
  const max = hasSecond ? (!optSecond ? val2 : val1) : val1;
  const options = hasThird ? val3 : hasSecond && optSecond ? val2 : {};

  return [min, max, { ...defaultRangeOptions, ...options }];
}

const defaultRangeOptions: Required<RangeOptions> = { step: 1, inc: false };
