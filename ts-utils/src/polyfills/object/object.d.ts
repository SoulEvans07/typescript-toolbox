declare interface Object {
  isProperty<T extends UnknownObject>(this: T, key: keyof T): key is PropertyKeys<T>;
  fromProperties<T extends UnknownObject>(this: T): Properties<T>;
}

declare interface ObjectConstructor {
  keysTyped<T extends UnknownObject>(obj: T): Array<keyof T>;
  entriesTyped<T extends UnknownObject>(obj: T): Array<[keyof T, T[keyof T]]>;
}

declare type UnknownObject = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/ban-types
declare type PropertyKeys<T extends UnknownObject> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
declare type Properties<T extends UnknownObject> = Pick<T, PropertyKeys<T>>;
