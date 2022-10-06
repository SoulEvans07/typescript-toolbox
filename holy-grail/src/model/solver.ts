import { Agent, ResourceType, Stats, Target } from './agent';

let incId = 0;

type StackState = {
  id: number;
  state: Stats;
  cost: number;
  parent: number | null; // Stats | null;
  steps: string[];
};

export function solver(agent: Agent, target: Target) {
  const open: StackState[] = [
    {
      id: ++incId,
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
    console.log('current:', current);

    if (checkTarget(current.state, target)) return close.reverse()[0].steps;

    Object.entries(agent.actions).forEach(([name, action]) => {
      try {
        const newState = action(current.state);

        const gx = agent.calcG(agent.stats, current.state, newState, target);
        const hx = agent.calcH(current.state, newState, target);
        console.log(name, newState, gx, hx, gx + hx);

        open.push({
          id: ++incId,
          // cost: Math.abs(Math.abs(diffTo.fullness) + Math.abs(diffFrom.food)),
          cost: gx + hx,
          state: newState,
          parent: current.id,
          steps: [...current.steps, name],
        });
      } catch (e) {
        // console.log((e as Error).message);
      }
    });
  }

  return { open, close };
}

function checkTarget(current: Stats, target: Partial<Stats>): boolean {
  return Object.keys(target).every(key => target[key as ResourceType] === current[key as ResourceType]);
}
