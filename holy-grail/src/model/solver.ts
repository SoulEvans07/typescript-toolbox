import { Agent, Stats, Target } from './agent';
import { CalcDiff } from './calcDiff';

type StackState = {
  state: Stats;
  cost: number;
  parent: Stats | null;
  steps: string[];
};

export function solver(agent: Agent, target: Target) {
  const open: StackState[] = [
    {
      state: agent.stats,
      cost: 0,
      parent: null,
      steps: [],
    },
  ];

  const close: StackState[] = [];

  let depth = 0;
  while (open.length) {
    depth++;
    if (depth > 100) break;

    const minCost = Math.min(...open.map(o => o.cost));
    const currentIndex = open.findIndex(o => o.cost === minCost);

    const current = open.splice(currentIndex, 1)[0];
    close.push(current);

    if (current.state.fullness === target.fullness) return close.reverse()[0].steps;

    Object.entries(agent.actions).forEach(([name, action]) => {
      const newState = action(current.state);
      const diffTo = CalcDiff.calc(target, newState) as Stats;
      const diffFrom = CalcDiff.calc(agent.stats, newState) as Stats;
      console.log('d', diffTo, diffFrom);

      open.push({
        state: newState,
        cost: Math.abs(Math.abs(diffTo.fullness) + Math.abs(diffFrom.food)),
        parent: current.state,
        steps: [...current.steps, name],
      });
    });
  }

  return { open, close };
}
