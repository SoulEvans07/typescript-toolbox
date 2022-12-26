export const StatNames = ['health', 'fullness', 'saturation', 'food'] as const;
export type StatName = typeof StatNames[number];

export type AgentState = Record<StatName, number>;

// export type StateRange = { _min?: number; _max?: number };
export type StateRange = { _min: number; _max: number };
export type AgentTargetState = Partial<Record<StatName, StateRange>>;

export type Action = (state: AgentState) => AgentState;
export type AgentActions = Record<string, Action>;

export type Agent = {
  state: AgentState;
  actions: AgentActions;
  goal: AgentTargetState;
  createPlan: (state: AgentState, actions: AgentActions, target: AgentTargetState, depth: number) => string[];
};
