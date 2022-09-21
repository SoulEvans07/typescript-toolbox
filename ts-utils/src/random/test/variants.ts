import { NumberGenerator } from '../types';

import { sfc32 } from '../prng/sfc32';
import { mulberry32 } from '../prng/mulberry32';

import { cyrb128 } from '../seed/cyrb128';
import { xmur3 } from '../seed/xmur3';
import { xmur3a } from '../seed/xmur3a';

export function sfc32_cyrb128(seed: string): NumberGenerator {
  const hashSeed = cyrb128(seed);
  return sfc32(...hashSeed);
}

export function sfc32_xmur3(seed: string): NumberGenerator {
  const hash = xmur3(seed);
  return sfc32(hash(), hash(), hash(), hash());
}

export function sfc32_xmur3a(seed: string): NumberGenerator {
  const hash = xmur3a(seed);
  return sfc32(hash(), hash(), hash(), hash());
}

export function mulberry32_cyrb128(seed: string): NumberGenerator {
  const hashSeed = cyrb128(seed);
  return mulberry32(hashSeed[0]);
}

export function mulberry32_xmur3(seed: string): NumberGenerator {
  const hash = xmur3(seed);
  return mulberry32(hash());
}

export function mulberry32_xmur3a(seed: string): NumberGenerator {
  const hash = xmur3a(seed);
  return mulberry32(hash());
}
