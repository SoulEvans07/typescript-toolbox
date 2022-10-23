declare interface Object {
  isProperty<T extends UnknownObject>(this: T, key: keyof T): key is PropertyKeys<T>;
  fromProperties<T extends UnknownObject>(this: T): Properties<T>;
  isFunction<T extends UnknownObject>(this: T, key: keyof T): key is FunctionKeys<T>;
  fromFunctions<T extends UnknownObject>(this: T): Functions<T>;
  fromAllFunctions<T extends UnknownObject>(this: T): Functions<T>;
}

declare interface ObjectConstructor {
  keysTyped<T extends UnknownObject>(obj: T): Array<keyof T>;
  entriesTyped<T extends UnknownObject>(obj: T): Array<[keyof T, T[keyof T]]>;
}

declare type Properties<T extends UnknownObject> = Pick<T, PropertyKeys<T>>;
declare type Functions<T extends UnknownObject> = Pick<T, FunctionKeys<T>>;
declare type PropertyKeys<T extends UnknownObject> = {
  [K in keyof T]: T[K] extends UnknownFunction ? never : K;
}[keyof T];
declare type FunctionKeys<T extends UnknownObject> = {
  [K in keyof T]: T[K] extends UnknownFunction ? K : never;
}[keyof T];

// eslint-disable-next-line @typescript-eslint/ban-types
declare type UnknownObject = Object;
// eslint-disable-next-line @typescript-eslint/ban-types
declare type UnknownFunction = Function;

declare type Constructor<T> = new (...args) => T;
declare type AbstractConstructor<T> = abstract new (...args) => T;
declare type AnyConstructor<T> = Constructor<T> | AbstractConstructor<T>;
