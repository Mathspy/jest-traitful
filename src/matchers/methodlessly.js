import _ from "lodash";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

function withoutMethods(obj) {
  return _.cloneDeepWith(obj, function customizer(v) {
    return _.isObject(v)
      ? _.cloneDeepWith(_.omitBy(v, _.isFunction), _.after(2, customizer))
      : undefined;
  });
}

function predicate(received, expected) {
  return _.isEqual(withoutMethods(received), withoutMethods(expected));
}

function message(received, expected, inverse) {
  return () =>
    `${matcherHint(
      `${inverse ? ".not" : ""}.toEqualWithoutMethods`,
      "received",
      "expected",
    )}\n\nExpected object without methods to${
      inverse ? " NOT " : " "
    }be the same as:\n  ${printExpected(withoutMethods(expected))}\nbut ${
      inverse ? "it was the same:" : "instead received:"
    }\n  ${printReceived(
      withoutMethods(received),
    )}\nand original object was:\n  ${printReceived(received)}`;
}

class Methodlessly {
  constructor(sample, inverse = false) {
    this.$$typeof = Symbol.for("jest.asymmetricMatcher");
    this.sample = sample;
    this.inverse = inverse;
  }

  asymmetricMatch(other) {
    return this.inverse
      ? !predicate(this.sample, other)
      : predicate(this.sample, other);
  }

  toString() {
    return `WithoutMethods${this.inverse ? "Not" : ""}SameAs`;
  }

  toAsymmetricMatcher() {
    return `WithoutMethods${this.inverse ? "Not" : ""}SameAs<${JSON.stringify(
      this.sample,
      null,
      2,
    )}>`;
  }

  // eslint-disable-next-line class-methods-use-this
  getExpectedType() {
    return "object";
  }
}

export default {
  symmetric: {
    toEqualWithoutMethods(received, expected) {
      const pass = predicate(received, expected);
      return {
        pass,
        message: message(received, expected, pass),
      };
    },
  },
  asymmetric: {
    methodlessly: Methodlessly,
  },
};
