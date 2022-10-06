import produce from 'immer';
import { Agent, Resources, Stats, Target } from './agent';
import { solver } from './solver';

const from: Stats = {
  health: 100,
  fullness: 80,
  food: 100,
};

const to: Target = {
  fullness: 100,
};

const agent: Agent = {
  stats: from,
  prio: {
    health: 100,
    fullness: 50,
    food: 20,
  },
  calcWeight(input: Stats): number {
    return Resources.reduce((sum, key) => sum + input[key] * this.prio[key], 0);
  },
  actions: {
    run(state: Stats) {
      return produce(state, draft => {
        draft.fullness -= 2;
      });
    },
    eat(state: Stats) {
      return produce(state, draft => {
        draft.fullness += 1;
        draft.food -= 1;
      });
    },
    feast(state: Stats) {
      return produce(state, draft => {
        draft.fullness += 3;
        draft.food -= 2;
      });
    },
  },
};

export function main() {
  const plan = solver(agent, to);
  console.log(plan);
}
