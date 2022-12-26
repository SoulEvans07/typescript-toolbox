import produce from 'immer';
import { Agent, Resources, ResourceType, Stats, Target } from './agent';
import { CalcDiff } from './calcDiff';
import { solver } from './solver';

const from: Stats = {
  health: 100,
  saturation: 100,
  fullness: 15,
  food: 0,
};

const to: Target = {
  fullness: 20,
  food: 10,
};

const targetKeys = Object.keys(to) as ('fullness' | 'food')[];

const limits = {
  fullness: { min: 0, max: 100 },
  food: { min: 0 },
  health: { min: 0 },
} as const;

const agent: Agent = {
  stats: from,
  prio: {
    health: 100,
    saturation: 50,
    fullness: 50,
    food: 20,
  },
  limits,
  calcG(start: Stats, prev: Stats, curr: Stats, target: Partial<Stats>): number {
    const diff = CalcDiff.calc(start, curr) as Stats;

    return Resources.reduce((sum, key) => {
      let amp = -1;
      let value = diff[key];

      const limit = this.limits[key];
      if (limit?.min !== undefined && curr[key] < limit.min) amp = 1;
      if (limit?.max !== undefined && curr[key] > limit.max) amp = 1;

      const targetValue = target[key];
      if (targetValue !== undefined && prev[key] >= targetValue) {
        value = targetValue;
        amp = 1;
        // console.warn(amp * value * this.prio[key]);
      }

      return sum + amp * value * this.prio[key];
    }, 0);
  },
  calcH(prev: Stats, curr: Stats, target: Partial<Stats>): number {
    const diff = CalcDiff.calc(curr, target) as Stats;

    const t = prev.fullness >= target.fullness!;

    return targetKeys.reduce((sum, key) => {
      let amp = 1;

      const targetValue = target[key];
      if (targetValue === undefined || prev[key] >= targetValue) {
        amp = 0;
        console.warn(key, sum, diff[key], diff[key] * this.prio[key]);
      }

      const val = sum + diff[key] * this.prio[key] * amp;
      if (t) console.warn('new', key, sum, val);
      return val;
    }, 0);
  },
  calcWeight(input: Stats): number {
    return Resources.reduce((sum, key) => sum + input[key] * this.prio[key], 0);
  },
  actions: {
    run(state: Stats) {
      return produce(state, draft => {
        draft.fullness = Math.clamp(draft.fullness - 2, 0, 100);
        if (draft.fullness <= 10) draft.health -= 1;
      });
    },
    eat(state: Stats) {
      return produce(state, draft => {
        draft.fullness += 1;
        draft.food -= 1;
        if (draft.food < limits.food.min) throw new Error('Food cant be less than 0');
        if (draft.fullness <= 10) draft.health -= 1;
      });
    },
    feast(state: Stats) {
      return produce(state, draft => {
        draft.fullness += 3;
        draft.food -= 3;
        if (draft.food < limits.food.min) throw new Error('Food cant be less than 0');
        if (draft.fullness <= 10) draft.health -= 1;
      });
    },
    gather(state: Stats) {
      return produce(state, draft => {
        draft.food = 5;
        draft.fullness = Math.clamp(draft.fullness - 1, 0, 100);
        if (draft.fullness <= 10) draft.health -= 1;
      });
    },
  },
};

export function main() {
  const plan = solver(agent, to);
  console.log(plan);
}
