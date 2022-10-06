export const Resources = ['health', 'fullness', 'food'] as const;
export type ResourceType = typeof Resources[number];

export type Stats = Record<ResourceType, number>;
export type StatPrio = Record<keyof Stats, number>;

export type Target = Partial<Stats>;

export type Action = (state: Stats) => Stats;
export type AgentActions = Record<string, Action>;

export type Agent = {
  stats: Stats;
  prio: StatPrio;
  actions: AgentActions;
  calcWeight: (values: Stats) => number;
};
