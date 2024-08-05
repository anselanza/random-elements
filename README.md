# Random Element picker

Provides a nicely-typed, well-tested utility for picking one or multiple random element(s) from an array.

Pretty simple.

The main benefits of this over doing it yourself:

- Proper TypeScript generics ensure that the type of element array you submit is returned with the same types. Makes the compiler happy when you use this library in your own code.
- Well tested, so prevents silly range errors and unexpected results.

## Simple random picking:

- `pickRandomIndex`
- `pickRandomIndexes`
- `pickRandomElement` (type safe arrays! no mutation!)
- `pickMultipleRandomElements` (same as above, but returns multiple elements)

### Example
```
const myArray = ["one", "two", "three"];
const answer = pickRandomElement(myArray);

// Typescript will know that "answer" is a string
```

## Weighted distributions:
Sometimes you want to weight certain outcomes more or less likely than others. This library lets you pass a Map of keys with relative probabilities (weights), and each time you call the function, you will get a single key back but with the probabilities stacked in favour of the ones you weighted higher.

- `pickKeysWithWeights`

### Examples
Note the different ways of building the Map object; either construct an empty one and `set` some elements (Example 1), or do it in one go, in the constructor (Example 2).

#### Example 1
```
const weights = new Map();
weights.set("one", 1);
weights.set("two", 1);
weights.set("three", 2);

const pick = pickKeysWithWeights(weights);

// Expect to get "three" roughly twice as often compared to "one" or "two". The chances of getting "three" any given time is 50%, however - that's probability, folks!
```


#### Example 2
```
const weights = new Map([
  ["heads", 2],
  ["tails", 1]
]);

const pick = pickKeysWithWeights(weights);

// Expect to get "heads" roughly twice as often as "tails". That means 66.6% chance vs 33.3% chance, right?

```

