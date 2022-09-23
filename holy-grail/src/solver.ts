import { Agent, AgentState } from './types/agent';
import { CalcDiff } from './calcDiff';

type StackState = {
  currentState: AgentState;
  cost: number;
  parent: AgentState | null;
  steps: string[];
};

export function solver(agent: Agent, target: Partial<AgentState>) {
  const open: StackState[] = [
    {
      currentState: agent.state,
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

    if (current.currentState.hunger === target.hunger) return close.reverse()[0].steps;

    Object.entries(agent.actions).forEach(([name, action]) => {
      const newState = action(current.currentState);
      const diffTo = CalcDiff.calc(target, newState) as AgentState;
      const diffFrom = CalcDiff.calc(agent.state, newState) as AgentState;
      console.log(diffTo, diffFrom);

      open.push({
        currentState: newState,
        cost: Math.abs(Math.abs(diffTo.hunger) + Math.abs(diffFrom.food)),
        parent: current.currentState,
        steps: [...current.steps, name],
      });
    });
  }

  return { open, close };
}
