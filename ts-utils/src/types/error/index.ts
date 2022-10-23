export abstract class Exception extends Error {
  public abstract readonly name: string;

  public is<T extends Exception>(type: Constructor<T>): this is T {
    return this.name === type.name;
  }

  public static is<T extends Exception>(error: Error, type: Constructor<T>): error is T {
    console.log('error', error.name, 'type', type.prototype.name);
    return error.name === type.name;
  }

  /**
   * @throws {NotExceptionError}
   */
  public static from(obj: unknown): Exception {
    if (typeof obj === 'string') return new UnknownError(obj);
    if (obj instanceof Error) return Object.setPrototypeOf(obj, Exception.prototype);
    // TODO: handle objects but not booleans, numbers or other primitives besides string
    throw new NotExceptionError(JSON.stringify(obj));
  }
}

export class UnknownError extends Exception {
  name = UnknownError.name;
}

export class NotExceptionError extends Exception {
  name = NotExceptionError.name;
}
