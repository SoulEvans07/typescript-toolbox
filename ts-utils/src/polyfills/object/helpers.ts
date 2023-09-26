/* eslint-disable @typescript-eslint/ban-types */
export type PropertyKey<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type Properties<T> = Pick<T, PropertyKey<T>>;

export function isPropertyKey<T extends Object>(obj: T, key: keyof T): key is PropertyKey<T> {
  return Object.hasOwn(obj, key) && typeof obj[key] !== 'function';
}

export class ObjectHelper {
  static isProperty<T extends UnknownObject>(obj: T, key: keyof T): key is PropertyKeys<T> {
    return typeof obj[key] !== 'function';
  }

  static properties<T extends Object>(obj: T): Properties<T> {
    const props = {} as Properties<T>;

    for (const key in obj) {
      if (isPropertyKey(obj, key)) props[key] = obj[key];
    }

    return props;
  }

  static isFunction<T extends UnknownObject>(obj: T, key: keyof T): key is FunctionKeys<T> {
    return typeof obj[key] === 'function';
  }

  static functions<T extends UnknownObject>(obj: T): Functions<T> {
    const props = {} as Functions<T>;

    const classType = Object.getPrototypeOf(obj);
    const keys = Object.getOwnPropertyNames(classType).filter(k => k !== 'constructor') as Array<keyof T>;
    keys.forEach(key => {
      if (this.isFunction(obj, key)) props[key] = obj[key];
    });

    return props;
  }

  static functionsAll<T extends UnknownObject>(obj: T): Functions<T> {
    const props = {} as Functions<T>;

    const classType = Object.getPrototypeOf(obj);
    const keys = this.keysAll(classType) as Array<keyof T>;
    keys.forEach(key => {
      if (this.isFunction(obj, key)) props[key] = obj[key];
    });

    return props;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static keysAll<T extends Object>(toCheck: T): Array<keyof T> {
    const props: Array<keyof T> = [];

    let obj = toCheck;
    do {
      const keys = Object.getOwnPropertyNames(obj) as Array<keyof T>;
      // const filtered = keys.filter(k => Object.hasOwn(toCheck, k));
      props.push(...keys);
    } while ((obj = Object.getPrototypeOf(obj)) && obj.constructor.name !== 'Object');

    return props.sort().filter(k => k !== 'constructor');
  }
}
