describe('Number:polyfill', () => {
  describe('.pad()', () => {
    const val = 12;
    const len = 5;

    describe('default char', () => {
      testPad(val, len);
    });

    describe('# char', () => {
      testPad(val, len, '#');
    });

    function testPad(val: number, len: number, char: string = '0') {
      const padded = val.pad(len, char);

      test('value', () => {
        expect(padded).toHaveLength(len);
      });

      test('start', () => {
        expect(padded).toStartWith(''.padStart(len - String(val).length, char));
      });

      test('end', () => {
        expect(padded).toEndWith(String(val));
      });
    }
  });
});
