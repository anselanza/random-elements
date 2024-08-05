import {
  getRangesFor,
  pickKeysWithWeights,
  pickMultipleRandomElements,
  pickRandomElement,
  pickRandomIndex,
  pickRandomIndexes,
} from ".";

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
    const elements = pickMultipleRandomElements(inputArray, 2);
    expect(elements.length).toBe(2);
  });
  test("each element should exist in the original array", () => {
    const elements = pickMultipleRandomElements(inputArray, inputArray.length);
    for (const e of elements) {
      expect(inputArray).toContain(e);
    }
  });
  test("invalid count values should throw Error", () => {
    expect(() => {
      pickMultipleRandomElements(inputArray, 0);
    }).toThrow("out of range");
    expect(() => {
      pickMultipleRandomElements(inputArray, 10);
    }).toThrow("out of range");
  });
  test("the same element should never appear more than once", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const count = Math.floor(1 + Math.random() * inputArray.length);
      // console.log({ count });
      const elements = pickMultipleRandomElements(inputArray, count);
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

describe("Convenient index-picking utilities", () => {
  test("all indexes from result should be unique", () => {
    const indexesPicked = pickRandomIndexes(3, 3);
    expect(indexesPicked).toHaveLength(3);
    expect(indexesPicked.filter((x) => x === 0)).toHaveLength(1);
    expect(indexesPicked.filter((x) => x === 1)).toHaveLength(1);
    expect(indexesPicked.filter((x) => x === 2)).toHaveLength(1);
  });

  test("all indexes from result should be in range", () => {
    for (let i = 0; i < REPETITIONS; i++) {
      const indexesPicked = pickRandomIndexes(10, 5); // 50%
      expect(indexesPicked.every((x) => x >= 0 && x < 10)).toBeTruthy();
    }
  });
  test("all possible combinations/orders should appear", () => {
    let combinations = [];
    for (let i = 0; i < REPETITIONS; i++) {
      const indexesPicked = pickRandomIndexes(3, 3);
      combinations.push(indexesPicked);
    }
    expect(combinations).toHaveLength(REPETITIONS);

    const possible = ["012", "021", "201", "210", "120", "102"];
    let found = new Set();

    for (const c of combinations) {
      const pattern = c.join("");
      expect(possible.find((x) => x === pattern)).toBeDefined(); // no impossible combinations
      found.add(pattern);
    }

    expect(found.size).toBe(6);
  });

  test("specifying count larger than size throws error", () => {
    expect(() => {
      pickRandomIndexes(3, 4);
    }).toThrow("out of range");
  });

  test("specifying size zero throws error", () => {
    expect(() => {
      pickRandomIndexes(0, 0);
    }).toThrow();
  });
});

describe("Picking with weighted distributions", () => {
  const items = ["one", "two", "three", "four"];
  const SAMPLE_RUNS = 10000;
  test("normally, the same element will occur roughly in 1/n", () => {
    let count = 0;
    for (let i = 0; i < SAMPLE_RUNS; i++) {
      const p = pickRandomElement(items);
      if (p == "one") {
        count++;
      }
    }
    expect(Math.abs(count / SAMPLE_RUNS - 0.25)).toBeLessThanOrEqual(0.25 / 2);
  });

  test("convert relative weights into ranges", () => {
    const WEIGHTED_HEADS = new Map([
      ["heads", 3],
      ["tails", 1],
    ]);

    const ranges = getRangesFor(WEIGHTED_HEADS);

    expect(ranges.get("heads")).toEqual([0, 0.75]);
    expect(ranges.get("tails")).toEqual([0.75, 1]);
  });

  test("in 50/50 situation, item weighted twice as likely should appear roughly twice as often", () => {
    const WEIGHTED_HEADS = new Map([
      ["heads", 2],
      ["tails", 1],
    ]);

    let counts = {
      heads: 0,
      tails: 0,
    };
    for (let i = 0; i < SAMPLE_RUNS; i++) {
      const p = pickKeysWithWeights(WEIGHTED_HEADS);
      if (p == "heads") {
        counts.heads++;
      } else counts.tails++;
    }

    const percentages = {
      heads: counts.heads / SAMPLE_RUNS,
      tails: counts.tails / SAMPLE_RUNS,
    };

    console.log({ counts, percentages });

    // With ratio 2:1, we expect roughly 1/3 heads vs 2/3 tails
    expect(Math.abs(percentages.heads - 0.666)).toBeLessThan(0.1);
    expect(Math.abs(percentages.tails - 0.333)).toBeLessThan(0.1);
  });

  test("in 50/50 situation, item weighted ten as likely should appear roughly ten times as often", () => {
    const WEIGHTED_HEADS = new Map([
      ["heads", 10],
      ["tails", 1],
    ]);

    let counts = {
      heads: 0,
      tails: 0,
    };
    for (let i = 0; i < SAMPLE_RUNS * 2; i++) {
      const p = pickKeysWithWeights(WEIGHTED_HEADS);
      if (p == "heads") {
        counts.heads++;
      } else counts.tails++;
    }

    const ratio = counts.heads / counts.tails;

    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeCloseTo(10, 0);
  });
});
