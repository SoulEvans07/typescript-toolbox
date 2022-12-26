import { Agent, AgentActions, AgentState, AgentTargetState } from './types';

const state: AgentState = {
  health: 100,
  saturation: 100,
  fullness: 15,
  food: 0,
};

const actions: AgentActions = {};

const goal: AgentTargetState = {
  fullness: { _min: 15, _max: 50 },
  food: { _min: 10, _max: 20 },
};

const maxDepth = 100;
function createPlan(state: AgentState, actions: AgentActions, target: AgentTargetState, depth = maxDepth) {
  if (depth === 0) return [];

  const open = [
    {
      state,
      cost: 0,
      heuristic: heuristic(state, target),
    },
  ];

  return [];
}

function heuristic(state: AgentState, goalArea: AgentTargetState) {
  return point2CuboidDistance(state, goalArea);
}

type NamedVector = Record<string, number>;
function vectorDistance(vectA: NamedVector, vectB: NamedVector) {
  const sumOfSquares = Object.keys(vectB).reduce((acc, key) => {
    const valueA = vectA[key];
    const valueB = vectB[key];

    if (valueA === undefined || valueB === undefined) return acc;

    return acc + Math.pow(valueA - valueB, 2);
  }, 0);

  return Math.sqrt(sumOfSquares);
}

type NDCuboid = Record<string, { _min: number; _max: number }>; // N-Dimensional Cuboid
function point2CuboidDistance(point: NamedVector, cuboid: NDCuboid) {
  // Calculate the dimensions of the cuboid
  // const sizes = Object.entriesTyped(cuboid).reduce(
  //   (acc, [key, { _min, _max }]) => ({ ...acc, [key]: Math.abs(_min - _max) }),
  //   {} as NamedVector
  // );

  // Calculate the minimum and maximum coordinates of the cuboid for each dimension
  const { minCoordinates, maxCoordinates } = Object.entriesTyped(cuboid).reduce(
    ({ minCoordinates, maxCoordinates }, [key, { _min, _max }]) => ({
      minCoordinates: { ...minCoordinates, [key]: Math.min(_min, _max) },
      maxCoordinates: { ...maxCoordinates, [key]: Math.max(_min, _max) },
    }),
    {
      minCoordinates: {},
      maxCoordinates: {},
    } as { minCoordinates: NamedVector; maxCoordinates: NamedVector }
  );

  // Calculate the distance between the point and the nearest point on the surface of the cuboid
  const nearestPoint = Object.keysTyped(minCoordinates).reduce((acc, key) => {
    const min = minCoordinates[key];
    const max = maxCoordinates[key];
    return {
      ...acc,
      [key]: Math.max(min, Math.min(max, point[key])),
    };
  }, {} as NamedVector);

  return vectorDistance(point, nearestPoint);
}

export const agent: Agent = {
  state,
  actions,
  goal,
  createPlan,
} as const;
