import { padNumber, parseRangeParams } from './helpers';
import { InvalidArgumentException } from './types';

if (!Number.prototype.pad) {
  Number.prototype.pad = function (length: number, char: string = '0') {
    return padNumber(this as number, length, char);
  };
}

if (!Number.pad) {
  Number.pad = function (value: number, length: number, char: string = '0') {
    return padNumber(value, length, char);
  };
}

if (!Number.range) {
  Number.range = function (val1: number, val2?: number | RangeOptions, val3?: RangeOptions): number[] {
    const [min, max, { step, inc }] = parseRangeParams(val1, val2, val3);

    if (max < min) throw new InvalidArgumentException('Max must be bigger than Min');
    if (step >= max - min) throw new InvalidArgumentException('Step must be smaller than (Max - Min)');
    if (step <= 0) throw new InvalidArgumentException('Step must be bigger than 0');

    const include = inc && (max - min) % step === 0;
    const count = Math.ceil((max - min) / step) + (include ? 1 : 0);

    return new Array(count).fill(null).map((_, i) => min + i * step);
  };
}
