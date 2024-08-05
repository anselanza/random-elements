export const pickRandomIndex = (arr: Readonly<any[]>): number =>
  Math.floor(Math.random() * arr.length);

/** Pick `count` indexes out of a sequence of indexes which counts from 0..`size` */
export const pickRandomIndexes = (size: number, count: number): number[] => {
  let arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i);
  }
  return pickMultipleRandomElements(arr, count);
};

/** Pseudo-random pick an alement of an array, retaining the element types. */
export const pickRandomElement = <T>(arr: Readonly<T[]>): T => {
  return arr[pickRandomIndex(arr)];
};

/** Pick exactly `count` elements from an array.
 * The same element will never appear more than once in the result, but
 * since we do not check for equality, if the original array contains
 * duplicates then these values may well occur multiple times in the result.
 *
 * The given array will NOT be modified.
 * */
export const pickMultipleRandomElements = <T>(
  arr: Readonly<T[]>,
  count: number
): T[] => {
  if (count < 1 || count > arr.length) {
    throw Error(
      `count is out of range: you provided ${count} which is not in the range [1;${arr.length}]`
    );
  }
  const shuffled = shuffleDurstenfeld(arr);
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i]);
  }
  return result;
};

/** Shuffles the given array without modifying the original array, i.e. returns a copy. */
const shuffleDurstenfeld = <T>(array: Readonly<T[]>): T[] => {
  let result = [...array]; // take copy
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// export type Weights<T> = Map<T, number>

export type WeightedKey<T> = [T, number];

type WeightKeyRanges<T> = [T, [number, number]];

export const getRangesFor = <T>(
  weightedKeys: WeightedKey<T>[]
): WeightKeyRanges<T>[] => {
  const total = weightedKeys.reduce((result, entry) => {
    const [_key, weight] = entry;
    return result + weight;
  }, 0);

  return weightedKeys.reduce((result, wk, i) => {
    const [key, weight] = wk;
    const previousWeight = result[i - 1];
    if (previousWeight) {
      const [_previousKey, previousRange] = previousWeight;
      const [_start, end] = previousRange;
      return [...result, [key, [end, end + weight / total]]];
    } else {
      return [[key, [0, weight / total]]];
    }
  }, [] as WeightKeyRanges<T>[]);
};

export const pickKeysWithWeights = <T>(weightedKeys: WeightedKey<T>[]): T => {
  const ranges = getRangesFor(weightedKeys);
  const randomNumber = Math.random();
  const withinRange = ranges.find((keyWithRange) => {
    const [key, range] = keyWithRange;
    const [start, end] = range;
    return randomNumber >= start && randomNumber < end;
  });
  if (withinRange) {
    const [key] = withinRange;
    return key;
  } else {
    throw Error(
      `nothing in range ${JSON.stringify(ranges)} with value ${randomNumber}`
    );
  }
};
