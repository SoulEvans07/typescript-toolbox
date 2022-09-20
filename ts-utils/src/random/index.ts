export class Random {
  private number: () => number;

  constructor(seed: number = Random.createSeed()) {
    const [a, b, c, d] = cyrb128(String(seed));
    this.number = sfc32(a, b, c, d);
  }

  integer(max: number): number;
  integer(min: number, max: number): number;
  integer(val1 = 1, val2?: number): number {
    const min = val2 === undefined ? 0 : val1;
    const max = val2 === undefined ? val1 : val2;
    return min + Math.floor(this.number() * (max - min + 1));
  }

  shuffle<T>(array: T[]) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.integer(i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  private static createSeed() {
    const size = Number.MAX_SAFE_INTEGER;
    return Math.floor(Math.random() * size);
  }
}

// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function cyrb128(str: string) {
  let [h1, h2, h3, h4] = [1779033703, 3144134277, 1013904242, 2773480762];

  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}
