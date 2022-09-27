import { NumberGenerator } from '../types';

// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
export function xmur3a(str: string): NumberGenerator {
  let h = 2166136261 >>> 0;

  for (let i = 0; i < str.length; i++) {
    let k = Math.imul(str.charCodeAt(i), 3432918353);
    k = (k << 15) | (k >>> 17);
    h ^= Math.imul(k, 461845907);
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 3864292196) | 0;
  }

  h ^= str.length;

  return function (): number {
    h ^= h >>> 16;
    h = Math.imul(h, 2246822507);
    h ^= h >>> 13;
    h = Math.imul(h, 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
