import { Agent, Resources, ResourceType, ResourceValues, Target } from './agent';
import { solver } from './solver';

const resources: Resources = {
  hunger: { value: 100, prio: 100 },
  food: { value: 100, prio: 50 },
};

const to: Target = {
  hunger: 80,
};

const agent: Agent = {
  resources,
  update(values: ResourceValues) {
    Object.entries(values).forEach(([key, value]) => {
      this.resources[key as ResourceType].value === value;
    });
  },
  getValues(): ResourceValues {
    return Object.entries(this.resources).reduce(
      (values, [key, { value }]) => ({
        ...values,
        [key]: value,
      }),
      {} as ResourceValues
    );
  },
  weighPriorities(resources: Resources): number {
    const values = Object.values(resources);
    return values.reduce((sum, curr) => sum + curr.prio * curr.value, 0);
  },
  actions: {
    run(state: ResourceValues) {
      return { ...state, hunger: state.hunger + 2 };
    },
    eat(state: ResourceValues) {
      return { ...state, hunger: state.hunger - 1, food: state.food - 1 };
    },
    feast(state: ResourceValues) {
      return { ...state, hunger: state.hunger - 3, food: state.food - 3 };
    },
  },
};

const plan = solver(agent, to);
console.log(plan);
