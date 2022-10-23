describe('Object:polyfill', () => {
  describe('.isProperty()', () => {
    test('no functions', () => {
      const obj = onlyProps;
      const allKeys = Object.keysTyped(obj);
      allKeys.forEach(key => expect(obj.isProperty(key)).toBeTrue());
    });

    test('only functions', () => {
      const obj = onlyFunctions;
      const allKeys = Object.keysTyped(obj);
      allKeys.forEach(key => expect(obj.isProperty(key)).toBeFalse());
    });

    test('object with functions', () => {
      const obj = { ...onlyProps, ...onlyFunctions };
      const propKeys = Object.keysTyped(onlyProps);
      const funcKeys = Object.keysTyped(onlyFunctions);
      propKeys.forEach(key => expect(obj.isProperty(key)).toBeTrue());
      funcKeys.forEach(key => expect(obj.isProperty(key)).toBeFalse());
    });
  });

  describe('.fromProperties()', () => {
    test('empty object', () => {
      const props = {}.fromProperties();
      expect(props).toStrictEqual({});
    });

    test('no functions', () => {
      const props = onlyProps.fromProperties();
      expect(props).toStrictEqual(onlyProps);
    });

    test('only functions', () => {
      const props = onlyFunctions.fromProperties();
      expect(props).toStrictEqual({});
    });

    test('object with functions', () => {
      const props = { ...onlyProps, ...onlyFunctions }.fromProperties();
      expect(props).toStrictEqual(onlyProps);
    });
  });

  // TODO: to be implemented @adam.szi
  describe.skip('.isFunction()', () => {
    test('no functions', () => expect(false).toBeTrue());
    test('only functions', () => expect(false).toBeTrue());
    test('object with functions', () => expect(false).toBeTrue());
  });

  // TODO: to be implemented @adam.szi
  describe.skip('.fromFunctions()', () => {
    test('empty object', () => expect(false).toBeTrue());
    test('no functions', () => expect(false).toBeTrue());
    test('only functions', () => expect(false).toBeTrue());
    test('object with functions', () => expect(false).toBeTrue());
  });

  // TODO: to be implemented @adam.szi
  describe.skip('.fromAllFunctions()', () => {
    test('empty object', () => expect(false).toBeTrue());
    test('no functions', () => expect(false).toBeTrue());
    test('only functions', () => expect(false).toBeTrue());
    test('object with functions', () => expect(false).toBeTrue());
  });

  const onlyFunctions = {
    func0() {
      console.log();
    },
    func1() {
      return 1;
    },
    func2(a: number) {
      return a * 2;
    },
    f0: (): void => void 0,
    f1: () => 1,
    f2: (a: number) => 2 * a,
  };

  const onlyProps = {
    a: 0,
    b: 1,
    c: 'str',
    d: false,
  };
});
