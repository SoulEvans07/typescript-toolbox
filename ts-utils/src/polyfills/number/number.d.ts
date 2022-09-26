declare interface Number {
  pad(length: number, char?: string): string;
}

declare interface NumberConstructor {
  pad(value: number, length: number, char?: string): string;

  /**
   * @throws {InvalidArgumentException}
   */
  range(max: number, options?: RangeOptions): number[];
  range(min: number, max: number, options?: RangeOptions): number[];
}

declare interface RangeOptions {
  /**
   * inclusive: include max if (max - min) % step === 0
   * @default false
   */
  inc?: boolean;

  /**
   * @default 1
   */
  step?: number;
}
