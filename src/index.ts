export const pickRandomIndex = (arr: any[]): number =>
  Math.floor(Math.random() * arr.length);

/** Pseudo-random pick an alement of an array, retaining the element types. */
export const pickRandomElement = <T>(arr: T[]): T => {
  return arr[pickRandomIndex(arr)];
};

/** Pick exactly `count` elements from an array.
 * The same element will never appear more than once in the result, but
 * since we do not check for equality, if the original array contains
 * duplicates then these values may well occur multiple times in the result. */
export const pickMultiple = <T>(arr: T[], count: number): T[] => {
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
const shuffleDurstenfeld = <T>(array: T[]): T[] => {
  let result = [...array]; // take copy
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
