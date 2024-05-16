export const pickRandomIndex = (arr: any[]): number =>
  Math.floor(Math.random() * arr.length);

export const pickRandomElement = <T>(arr: T[]): T => {
  return arr[pickRandomIndex(arr)];
};
