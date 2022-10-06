export const Resources = ['health', 'fullness', 'food'] as const;
export type ResourceType = typeof Resources[number];

export type Stats = Record<ResourceType, number>;
export type StatPrio = Record<keyof Stats, number>;

export type Range = { min?: number; max?: number };
export type StatLimits = Partial<Record<keyof Stats, Range>>;

export type Target = Partial<Stats>;

export type Action = (state: Stats) => Stats;
export type AgentActions = Record<string, Action>;

export type Agent = {
  stats: Stats;
  prio: StatPrio;
  limits: StatLimits;
  actions: AgentActions;
  calcWeight: (values: Stats) => number;
  calcG: (from: Stats, curr: Stats) => number;
  calcH: (curr: Stats, target: Partial<Stats>) => number;
};
