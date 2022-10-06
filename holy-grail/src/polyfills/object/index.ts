if (!Object.prototype.isProperty) {
  Object.prototype.isProperty = function <T extends UnknownObject>(this: T, key: keyof T): key is PropertyKeys<T> {
    return typeof this[key] !== 'function';
  };
}

if (!Object.prototype.fromProperties) {
  Object.prototype.fromProperties = function <T extends UnknownObject>(this: T): Properties<T> {
    const props = {} as Properties<T>;

    for (const key in this) {
      if (this.isProperty(key)) props[key] = this[key];
    }

    return props;
  };
}

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

export {};
