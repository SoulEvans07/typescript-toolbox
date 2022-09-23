export type AgentState = {
  hunger: number;
  food: number;
};

export type Action = (state: AgentState) => AgentState;
export type AgentActions = Record<string, Action>;

export type Agent = {
  state: AgentState;
  actions: AgentActions;
  weighPriorities: (values: AgentState) => number;
};
