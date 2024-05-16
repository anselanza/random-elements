import { pickMultiple, pickRandomElement, pickRandomIndex } from ".";

const REPETITIONS = 1000;

describe("index picker alone", () => {
  const inputArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  test("index is always a defined number", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const index = pickRandomIndex(inputArray);
      expect(index).toBeDefined();
      expect(typeof index).toBe("number");
    }
  });
  test("index is always within the expected range", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const index = pickRandomIndex(inputArray);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(inputArray.length - 1);
    }
  });
  test("index is always a whole number / integer", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const index = pickRandomIndex(inputArray);
      expect(Number.isInteger(index)).toBeTruthy();
    }
  });
  test("index 0 should appear at least once", () => {
    let found = false;
    let maxAttempts = REPETITIONS;
    while (maxAttempts > 0 && !found) {
      const index = pickRandomIndex(inputArray);
      if (index === 0) {
        // console.log("found", { index });
        found = true;
      }
    }
    expect(found).toBeTruthy();
  });
  test("last index should appear at least once", () => {
    let found = false;
    let maxAttempts = REPETITIONS;
    while (maxAttempts > 0 && !found) {
      const index = pickRandomIndex(inputArray);
      if (index === inputArray.length - 1) {
        // console.log("found", { index });
        found = true;
      }
    }
    expect(found).toBeTruthy();
  });
});

describe("basic pick single element", () => {
  const inputArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  test("result is always defined", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const el = pickRandomElement(inputArray);
      expect(el).toBeDefined();
    }
  });
  test("result can be found in the original array", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const el = pickRandomElement(inputArray);
      expect(inputArray.includes(el)).toBeTruthy();
    }
  });
  test("The first and last element of the array should appear at least once", () => {
    let foundFirst = false;
    let foundLast = false;
    let maxAttempts = REPETITIONS;
    // console.log({ maxAttempts });
    while (maxAttempts > 0 && !(foundFirst && foundLast)) {
      const el = pickRandomElement(inputArray);
      if (el == inputArray[0]) {
        // console.log("found", el);
        foundFirst = true;
      }
      if (el == inputArray[inputArray.length - 1]) {
        // console.log("found", el);
        foundLast = true;
      }
      maxAttempts--;
    }
    expect(maxAttempts).toBeGreaterThanOrEqual(0);
    expect(foundFirst).toBeTruthy();
    expect(foundLast).toBeTruthy();
  });
});

describe("Pick any number of unique elements", () => {
  const inputArray = ["one", "two", "three", "four", "five", "six", "seven"];
  test("pick 2", () => {
    const elements = pickMultiple(inputArray, 2);
    expect(elements.length).toBe(2);
  });
  test("each element should exist in the original array", () => {
    const elements = pickMultiple(inputArray, inputArray.length);
    for (const e of elements) {
      expect(inputArray).toContain(e);
    }
  });
  test("invalid count values should throw Error", () => {
    expect(() => {
      pickMultiple(inputArray, 0);
    }).toThrow("out of range");
    expect(() => {
      pickMultiple(inputArray, 10);
    }).toThrow("out of range");
  });
  test("the same element should never appear more than once", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const count = Math.floor(1 + Math.random() * inputArray.length);
      // console.log({ count });
      const elements = pickMultiple(inputArray, count);
      const onlyOnes = elements.filter((e) => e == "one");
      expect(Array.isArray(onlyOnes)).toBeTruthy();
      if (onlyOnes.length > 0) {
        expect(onlyOnes.length).toBe(1);
      } else {
        expect(onlyOnes.length).toBe(0);
      }
    }
  });
});
