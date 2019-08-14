<div align="center">
  <h1>jest-traitful</h1>

🃏🐯

A bundle of Jest matchers for simplifying testing traitful JavaScript

</div>

<hr />

[![Build Status](https://dev.azure.com/mathspy257/jest-traitful/_apis/build/status/Mathspy.jest-traitful?branchName=master)](https://dev.azure.com/mathspy257/jest-traitful/_build/latest?definitionId=1&branchName=master)
[![version](https://img.shields.io/npm/v/jest-traitful.svg?style=flat-square)](https://www.npmjs.com/package/jest-traitful)
[![downloads](https://img.shields.io/npm/dm/jest-traitful.svg?style=flat-square)](http://npm-stat.com/charts.html?package=jest-traitful&from=2017-09-14)
[![MIT License](https://img.shields.io/npm/l/jest-traitful.svg?style=flat-square)](https://github.com/mathspy/jest-traitful/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Problem

While using [Traitful JavaScript](https://mathspy.me/blog/traitful-javascript) it could often be hard to assert your structs

## Solution

jest-traitful aims to add additional matchers to Jest's default ones that simplifying testing traitful structs

## Contributing

If you've come here to help contribute - Sweet! Thanks! Take a look at the [contributing](/CONTRIBUTING.md) and read the [Code of Conduct](/CODE_OF_CONDUCT.md) docs as a way of getting started!

---

- [Problem](#problem)
- [Solution](#solution)
- [Contributing](#contributing)
- [Installation](#installation)
- [Setup](#setup)
- [Asymmetric matchers](#asymmetric-matchers)
- [API](#api)
  - [.toEqualWithoutMethods(object)](#toequalwithoutmethodsobject)
  - [expect.methodlessly(object)](#expectmethodlesslyobject)
  - [.toEqualTraitfully(object)](#toequaltraitfullyobject)
  - [expect.traitfully(object)](#expecttraitfullyobject)
- [LICENSE](#license)

## Installation

With npm:

```sh
npm install -D jest-traitful
```

With yarn:

```sh
yarn add -D jest-traitful
```

## Setup

### Jest >v24

Add `jest-traitful` to your Jest `setupFilesAfterEnv` configuration. [See for help](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array)

```json
"jest": {
  "setupFilesAfterEnv": ["jest-traitful"]
}
```

## Asymmetric matchers

All matchers described below have asymmetric variants. Example:

```js
test("symmetric vs asymmetric", () => {
  expect({ a: 1, x: () => {} }).toEqualWithoutMethods({ a: 1 });
  expect({ a: 1, x: () => {} }).toEqual(expect.methodlessly({ a: 1 }));
});
```

## API

#### .toEqualWithoutMethods(object)

Asserts that two objects are deeply equal if all their methods were completely ignored

```js
expect({ a: 1 }).toEqualWithoutMethods({ a: 1 }); // true
expect({ a: 1 }).toEqualWithoutMethods({ a: 1, x: () => {} }); // true
expect({ a: 1, x: () => {} }).toEqualWithoutMethods({ a: 1 }); // true
expect({ a: 1, x: () => {} }).toEqualWithoutMethods({ a: 1, x: () => {} }); // true
expect({ a: 1, x: () => {} }).toEqualWithoutMethods({ a: 1, y: () => {} }); // true

expect({ b: 1, x: () => {} }).not.toEqualWithoutMethods({ a: 1, x: () => {} }); // true
```

#### expect.methodlessly(object)

The asymmetric variant of `.toEqualWithoutMethods`.

```js
expect({ a: 1 }).toEqual(expect.methodlessly({ a: 1 })); // true
expect({ a: 1 }).toEqual(expect.methodlessly({ a: 1, x: () => {} })); // true
expect({ a: 1, x: () => {} }).toEqual(expect.methodlessly({ a: 1 })); // true
expect({ a: 1, x: () => {} }).toEqual(
  expect.methodlessly({ a: 1, x: () => {} }),
); // true
expect({ a: 1, x: () => {} }).toEqual(
  expect.methodlessly({ a: 1, y: () => {} }),
); // true

expect({ b: 1, x: () => {} }).toEqual(
  expect.not.methodlessly({ a: 1, x: () => {} }),
); // true
```

#### .toEqualTraitfully(object)

Asserts that two objects are deeply equal if all properties were identical but their methods were compared ONLY by name\
Whatever the methods' implementations or their signatures doesn't matter to this matcher\
_If Traitful JavaScript was followed this should basically assert full equality including functionality_

```js
expect({a: 1}).toEqualTraitfully({a: 1}); // true
expect({a: 1, x: () => {}}).toEqualTraitfully({a: 1, x: () => {}}); // true
expect({a: 1, x: () => true}).toEqualTraitfully({a: 1, x: () => false); // true

expect({a: 1, x: () => {}}).not.toEqualTraitfully({a: 1}); // true
expect({a: 1, x: () => {}}).not.toEqualTraitfully({a: 1, y: () => {}}); // true
expect({b: 1, x: () => {}}).not.toEqualTraitfully({a: 1, x: () => {}}); // true
```

#### expect.traitfully(object)

The asymmetric variant of `.toEqualTraitfully`.

```js
expect({a: 1}).toEqual(expect.traitfully({a: 1})); // true
expect({a: 1, x: () => {}}).toEqual(expect.traitfully({a: 1, x: () => {}})); // true
expect({a: 1, x: () => true}).toEqual(expect.traitfully({a: 1, x: () => false)); // true

expect({a: 1, x: () => {}}).toEqual(expect.traitfully({a: 1})); // true
expect({a: 1, x: () => {}}).toEqual(expect.traitfully({a: 1, y: () => {}})); // true
expect({b: 1, x: () => {}}).toEqual(expect.traitfully({a: 1, x: () => {}})); // true
```

## LICENSE

[MIT](/LICENSE)
