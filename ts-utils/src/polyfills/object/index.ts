/* TODO: move all to an ObjectHelper so we polyfill only the ones that are needed */

if (!Object.keysTyped) {
  Object.keysTyped = function <T extends UnknownObject>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>;
  };
}

if (!Object.entriesTyped) {
  Object.entriesTyped = function <T extends UnknownObject>(obj: T): Array<[keyof T, T[keyof T]]> {
    return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
  };
}

// NOTE: react native has issues with this @adam.szi
if (!Object.prototype.isProperty) {
  Object.prototype.isProperty = function <T extends UnknownObject>(this: T, key: keyof T): key is PropertyKeys<T> {
    return typeof this[key] !== 'function';
  };
}

// NOTE: react native has issues with this @adam.szi
if (!Object.prototype.isFunction) {
  Object.prototype.isFunction = function <T extends UnknownObject>(this: T, key: keyof T): key is FunctionKeys<T> {
    return typeof this[key] === 'function';
  };
}

// NOTE: react native has issues with this @adam.szi
if (!Object.prototype.fromProperties) {
  Object.prototype.fromProperties = function <T extends UnknownObject>(this: T): Properties<T> {
    const props = {} as Properties<T>;

    for (const key in this) {
      if (this.isProperty(key)) props[key] = this[key];
    }

    return props;
  };
}

// NOTE: react native has issues with this @adam.szi
if (!Object.prototype.fromFunctions) {
  Object.prototype.fromFunctions = function <T extends UnknownObject>(this: T): Functions<T> {
    const props = {} as Functions<T>;

    const classType = Object.getPrototypeOf(this);
    const keys = Object.getOwnPropertyNames(classType).filter(k => k !== 'constructor') as Array<keyof T>;
    keys.forEach(key => {
      if (this.isFunction(key)) props[key] = this[key];
    });

    return props;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getAllKeys<T extends Object>(toCheck: T): Array<keyof T> {
  const props: Array<keyof T> = [];

  let obj = toCheck;
  do {
    const keys = Object.getOwnPropertyNames(obj) as Array<keyof T>;
    // const filtered = keys.filter(k => Object.hasOwn(toCheck, k));
    props.push(...keys);
  } while ((obj = Object.getPrototypeOf(obj)) && obj.constructor.name !== 'Object');

  return props.sort().filter(k => k !== 'constructor');
}

// NOTE: react native has issues with this @adam.szi
if (!Object.prototype.fromAllFunctions) {
  Object.prototype.fromAllFunctions = function <T extends UnknownObject>(this: T): Functions<T> {
    const props = {} as Functions<T>;

    const classType = Object.getPrototypeOf(this);
    const keys = getAllKeys(classType) as Array<keyof T>;
    keys.forEach(key => {
      if (this.isFunction(key)) props[key] = this[key];
    });

    return props;
  };
}
