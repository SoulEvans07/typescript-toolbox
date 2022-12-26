// @ts-nocheck
export {};

const startingState = {
  // health: 100,
  // saturation: 100,
  // fullness: 15,
  // food: 0,
  value: 0,
  otherValue: 1,
};

const targetState = {
  value: { _min: 1, _max: 10 },
  // fullness: { _min: 15, _max: 20 },
  // food: { _min: 10, _max: 10 },
};

const actions = {
  addTwo: state => ({ ...state, value: state.value + 2 }),
  multiplyValueByThree: state => ({ ...state, value: state.value * 3 }),
  subtractFour: state => ({ ...state, value: state.value - 4 }),
  // run: (state) => {
  //   return produce(state, draft => {
  //     draft.fullness = Math.clamp(draft.fullness - 2, 0, 100);
  //     if (draft.fullness <= 10) draft.health -= 1;
  //   });
  // },
  // eat: (state) => {
  //   return produce(state, draft => {
  //     draft.fullness += 1;
  //     draft.food -= 1;
  //     // if (draft.food < limits.food.min) throw new Error('Food cant be less than 0');
  //     if (draft.fullness <= 10) draft.health -= 1;
  //   });
  // },
  // feast: (state) => {
  //   return produce(state, draft => {
  //     draft.fullness += 3;
  //     draft.food -= 3;
  //     // if (draft.food < limits.food.min) throw new Error('Food cant be less than 0');
  //     if (draft.fullness <= 10) draft.health -= 1;
  //   });
  // },
  // gather: (state) => {
  //   return produce(state, draft => {
  //     draft.food = 5;
  //     draft.fullness = Math.clamp(draft.fullness - 1, 0, 100);
  //     if (draft.fullness <= 10) draft.health -= 1;
  //   });
  // },
};

function findTransformations(state, transformationMap, target, maxDepth) {
  const transformationList = [];

  // Check if the state is already within the target range or if the max depth has been reached
  if (maxDepth === 0) {
    return transformationList;
  }
  if (isWithinRange(state, target)) {
    return transformationList;
  }

  // Iterate through the transformation map and try each transformation
  for (const key of Object.keys(transformationMap)) {
    const transformedState = transformationMap[key](state);
    const nextSteps = findTransformations(transformedState, transformationMap, target, maxDepth - 1);
    if (nextSteps.length > 0) {
      // If the transformation leads to a state within the target range, add it to the list
      transformationList.push(key);
      transformationList.push(...nextSteps);
      return transformationList;
    }
  }

  // If no transformation leads to a state within the target range, return an empty list
  return [];
}

function isWithinRange(obj, range) {
  // Recursively check if the values of the object are within the specified ranges
  for (const key of Object.keys(range)) {
    const value = obj[key];
    const rangeValue = range[key];
    if (typeof rangeValue === 'object') {
      // If the range value is an object, recursively check if the value is within the range
      if (!isWithinRange(value, rangeValue)) {
        return false;
      }
    } else if (typeof rangeValue === 'number') {
      // If the range value is a number, check if the value is within the range
      if (value < rangeValue._min || value > rangeValue._max) {
        return false;
      }
    } else {
      // If the range value is not an object or a number, the value cannot be compared
      return false;
    }
  }

  // If all the values are within the specified ranges, the object is within the range
  return true;
}

export function main() {
  const plan = findTransformations(startingState, actions, targetState, 100);
  console.log(plan);
}
