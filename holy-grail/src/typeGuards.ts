// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(x: unknown): x is Function {
  return Object.prototype.toString.call(x) === '[object Function]';
}

export function isArray(x: unknown): x is Array<unknown> {
  return Object.prototype.toString.call(x) === '[object Array]';
}

export function isDate(x: unknown): x is Date {
  return Object.prototype.toString.call(x) === '[object Date]';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject(x: unknown): x is Object {
  return Object.prototype.toString.call(x) === '[object Object]';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isValue(x: unknown) {
  return !isObject(x) && !isArray(x);
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number' && !isNaN(x);
}
