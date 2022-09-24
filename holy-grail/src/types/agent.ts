export type Resource = {
  value: number;
  prio: number;
};

export type Resources = {
  hunger: Resource;
  food: Resource;
};

export type ResourceType = keyof Resources;

export type ResourceValues = Record<ResourceType, number>;
export type Target = Partial<ResourceValues>;

export type Action = (state: ResourceValues) => ResourceValues;
export type AgentActions = Record<string, Action>;

export type Agent = {
  resources: Resources;
  actions: AgentActions;
  update: (values: ResourceValues) => void;
  getValues: () => ResourceValues;
  weighPriorities: (values: Resources) => number;
};
