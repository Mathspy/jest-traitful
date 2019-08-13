import _ from "lodash";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

function predicate(received, expected) {
  return _.isEqualWith(received, expected, function customizer(first, second) {
    return (_.isFunction(first) && _.isFunction(second)) || undefined;
  });
}

function message(received, expected, inverse) {
  return () =>
    `${matcherHint(
      `${inverse ? ".not" : ""}.toEqualTraitfully`,
      "received",
      "expected",
    )}\n\nExpected object to${
      inverse ? " NOT " : " "
    }have identical properties AND methods with same names as:\n  ${printExpected(
      expected,
    )}\nbut ${
      inverse ? "they were identical:" : "instead received:"
    }\n  ${printReceived(received)}`;
}

class Traitfully {
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
    return `Traitfully${this.inverse ? "Not" : ""}SameAs`;
  }

  toAsymmetricMatcher() {
    return `Traitfully${this.inverse ? "Not" : ""}SameAs<${JSON.stringify(
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
    toEqualTraitfully(received, expected) {
      const pass = predicate(received, expected);
      return {
        pass,
        message: message(received, expected, pass),
      };
    },
  },
  asymmetric: {
    traitfully: Traitfully,
  },
};
