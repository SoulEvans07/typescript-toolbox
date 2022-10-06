import produce from 'immer';
import { Agent, Resources, Stats, Target } from './agent';
import { CalcDiff } from './calcDiff';
import { solver } from './solver';

const from: Stats = {
  health: 100,
  fullness: 80,
  food: 100,
};

const to: Target = {
  fullness: 100,
};

const targetKeys = Object.keys(to);
const dontCare = Resources.filter(r => !targetKeys.includes(r));

const limits = {
  fullness: { min: 0, max: 100 },
  food: { min: 0 },
  health: { min: 0 },
} as const;

const agent: Agent = {
  stats: from,
  prio: {
    health: 100,
    fullness: 50,
    food: 20,
  },
  limits,
  calcG(from: Stats, curr: Stats): number {
    const diff = CalcDiff.calc(from, curr) as Stats;

    return Resources.reduce((sum, key) => {
      const limit = this.limits[key];
      let amp = -1;
      if (limit?.min !== undefined && curr[key] < limit.min) amp = 1;
      if (limit?.max !== undefined && curr[key] > limit.max) amp = 1;
      return sum + amp * diff[key] * this.prio[key];
    }, 0);
  },
  calcH(curr: Stats, target: Partial<Stats>): number {
    const diff = CalcDiff.calc(curr, target) as Stats;
    for (const key of dontCare) diff[key] = 0;
    return Resources.reduce((sum, key) => sum + diff[key] * this.prio[key], 0);
  },
  calcWeight(input: Stats): number {
    return Resources.reduce((sum, key) => sum + input[key] * this.prio[key], 0);
  },
  actions: {
    run(state: Stats) {
      return produce(state, draft => {
        draft.fullness = Math.clamp(draft.fullness - 2, 0, 100);
        if (draft.fullness < 0) draft.health -= 10;
      });
    },
    eat(state: Stats) {
      return produce(state, draft => {
        draft.fullness += 1;
        draft.food -= 1;
        if (draft.food < limits.food.min) throw new Error('Food cant be less than 0');
      });
    },
    feast(state: Stats) {
      return produce(state, draft => {
        draft.fullness += 3;
        draft.food -= 3;
        if (draft.food < limits.food.min) throw new Error('Food cant be less than 0');
      });
    },
  },
};

export function main() {
  const plan = solver(agent, to);
  console.log(plan);
}
