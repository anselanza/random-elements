import { pickRandom } from ".";

describe("basic pick", () => {
  test("result is defined", () => {
    const inputArray = [10, 20, 30, 40, 50];
    const el = pickRandom(inputArray);
    expect(el).toBeDefined();
  });
});
