interface CustomMatchers<R = unknown> {
  toThrowType(errorType: Constructor<Error>): R;
  toThrowSubType(errorType: AnyConstructor<Error>): R;
}

declare namespace jest {
  interface Matchers<R> extends CustomMatchers<R> {}
}
