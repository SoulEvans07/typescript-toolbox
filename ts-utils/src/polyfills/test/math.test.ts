describe('Math:polyfill', () => {
  describe('.clamp()', () => {
    test('in range', () => {
      const testCount = 100;
      const [min, max] = [0, 1];

      for (let i = 0; i < testCount; i++) {
        const value = Math.random();
        expect(Math.clamp(value, min, max)).toBe(value);
      }
    });

    test('under range', () => {
      const testCount = 100;
      const [min, max] = [0, 1];

      for (let i = 0; i < testCount; i++) {
        const value = min - Math.random() * 10;
        expect(Math.clamp(value, min, max)).toBe(min);
      }
    });

    test('over range', () => {
      const testCount = 100;
      const [min, max] = [0, 1];

      for (let i = 0; i < testCount; i++) {
        const value = max + Math.random() * 10;
        expect(Math.clamp(value, min, max)).toBe(max);
      }
    });
  });
});
