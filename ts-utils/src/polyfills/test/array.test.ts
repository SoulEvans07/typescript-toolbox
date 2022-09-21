describe('Array:polyfill', () => {
  describe('.naturalSort()', () => {
    const randomize = () => (Math.random() > 0.5 ? 1 : -1);

    test('number[]', () => {
      const original = new Array(10).fill(null).map((_, i) => i);
      const shuffled = [...original].sort(randomize);
      expect(shuffled.naturalSort()).toStrictEqual(original);
    });

    test('char[]', () => {
      const AaBbCc = new Array(26)
        .fill(null)
        .flatMap((_, i) => [String.fromCharCode(65 + i), String.fromCharCode(97 + i)]);
      const shuffled = [...AaBbCc].sort(randomize);
      expect(shuffled.naturalSort()).toStrictEqual(AaBbCc);
    });
  });

  describe('.limit()', () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    test('length is correct', () => {
      const length = 3;
      const short = array.limit(length);
      expect(short).toHaveLength(length);
    });

    test('values are correct', () => {
      const expected = [array[0], array[1], array[2], array[3]];
      const length = expected.length;

      const short = array.limit(length);
      expect(short).toStrictEqual(expected);
    });
  });

  describe('.isEmpty()', () => {
    test('[] => true', () => {
      expect([].isEmpty()).toBeTrue();
    });

    test('[1] => false', () => {
      expect([1].isEmpty()).toBeFalse();
    });
  });

  test('.first()', () => {
    const array = ['a', 'b', 'c', 'd'];
    expect(array.first()).toStrictEqual(array[0]);
  });

  test('.last()', () => {
    const array = ['a', 'b', 'c', 'd'];
    expect(array.last()).toStrictEqual(array[array.length - 1]);
  });
});
