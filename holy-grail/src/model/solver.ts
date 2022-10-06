import { Agent, Resources, Stats, Target } from './agent';
import { CalcDiff } from './calcDiff';

type StackState = {
  state: Stats;
  cost: number;
  parent: Stats | null;
  steps: string[];
};

export function solver(agent: Agent, target: Target) {
  const targetKeys = Object.keys(target);
  const dontCare = Resources.filter(r => !targetKeys.includes(r));
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

    console.log('--------', current.steps.last(), current.cost, '--------');

    if (current.state.fullness === target.fullness) return close.reverse()[0].steps;

    Object.entries(agent.actions).forEach(([name, action]) => {
      try {
        const newState = action(current.state);

        // const diffFrom = CalcDiff.calc(agent.stats, newState) as Stats;
        // const diffTo = CalcDiff.calc(target, newState) as Stats;
        // for (const key of dontCare) diffTo[key] = 0;

        const gx = agent.calcG(agent.stats, newState);
        const hx = agent.calcH(newState, target);
        console.log(name, newState, gx, hx, gx + hx);

        open.push({
          // cost: Math.abs(Math.abs(diffTo.fullness) + Math.abs(diffFrom.food)),
          cost: gx + hx,
          state: newState,
          parent: current.state,
          steps: [...current.steps, name],
        });
      } catch (e) {
        // console.log((e as Error).message);
      }
    });
  }

  return { open, close };
}
