import { isDate, isFunction, isValue } from 'types/typeGuards';

const ValueState = {
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
  unchanged: 'unchanged',
} as const;

export class DeepDiff {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static map(obj1: any, obj2: any) {
    if (isFunction(obj1) || isFunction(obj2)) throw 'Invalid argument. Function given, object expected.';
    if (isValue(obj1) || isValue(obj2)) {
      return {
        type: this.compareValues(obj1, obj2),
        data: obj1 === undefined ? obj2 : obj1,
      };
    }

    const diff: Record<string, unknown> = {};
    for (const key in obj1) {
      if (isFunction(obj1[key])) {
        continue;
      }

      let value2 = undefined;
      if (obj2[key] !== undefined) {
        value2 = obj2[key];
      }

      diff[key] = this.map(obj1[key], value2);
    }
    for (const key in obj2) {
      if (isFunction(obj2[key]) || diff[key] !== undefined) {
        continue;
      }

      diff[key] = this.map(undefined, obj2[key]);
    }

    return diff;
  }

  static compareValues(value1: unknown, value2: unknown) {
    if (value1 === value2) {
      return ValueState.unchanged;
    }
    if (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime()) {
      return ValueState.unchanged;
    }
    if (value1 === undefined) {
      return ValueState.created;
    }
    if (value2 === undefined) {
      return ValueState.deleted;
    }
    return ValueState.updated;
  }
}
