import { solver } from './solver';
import { Agent, AgentState } from './types/agent';

const from: AgentState = {
  hunger: 100,
  food: 100,
};

const to: Partial<AgentState> = {
  hunger: 80,
};

const agent: Agent = {
  state: from,
  weighPriorities(values: AgentState): number {
    return values.hunger + values.food;
  },
  actions: {
    run(state: AgentState) {
      return { ...state, hunger: state.hunger + 2 };
    },
    eat(state: AgentState) {
      return { ...state, hunger: state.hunger - 1, food: state.food - 1 };
    },
    feast(state: AgentState) {
      return { ...state, hunger: state.hunger - 3, food: state.food - 3 };
    },
  },
};

const plan = solver(agent, to);
console.log(plan);
