# Random Element picker

Provides a nicely-typed, well-tested utility for picking one or multiple random element(s) from an array.

Pretty simple.

The main benefits of this over doing it yourself:

- Proper TypeScript generics ensure that the type of element array you submit is returned with the same types. Makes the compiler happy when you use this library in your own code.
- Well tested, so prevents silly range errors and unexpected results.

Useful functions:

- pickRandomIndex
- pickRandomIndexes
- pickRandomElement (type safe arrays! no mutation!)
- pickMultipleRandomElements (same as above, but returns multiple elements)
