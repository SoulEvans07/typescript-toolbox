import { isFunction, isNumber } from './typeGuards';

export class CalcDiff {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static calc(objA: any, objB: any) {
    if (isFunction(objA) || isFunction(objB)) throw 'Invalid argument. Function given, object expected.';
    if (isNumber(objA) || isNumber(objB)) {
      return (objB || 0) - (objA || 0);
    }

    const diff: Record<string, unknown> = {};
    for (const key in objA) {
      if (isFunction(objA[key])) continue;
      diff[key] = this.calc(objA[key], objB[key]);
    }
    for (const key in objB) {
      if (isFunction(objB[key]) || diff[key] !== undefined) continue;
      diff[key] = this.calc(0, objB[key]);
    }

    return diff;
  }
}
