import _ from "lodash";
import {
  matcherHint,
  EXPECTED_COLOR,
  RECEIVED_COLOR,
} from "jest-matcher-utils";
import { prettyFormat, INDENT_ALL } from "../utils";

function predicate(received, expected) {
  return _.isEqualWith(received, expected, function customizer(first, second) {
    if (first && first.$$typeof === Symbol.for("jest.asymmetricMatcher")) {
      return first.asymmetricMatch(second);
    }
    if (second && second.$$typeof === Symbol.for("jest.asymmetricMatcher")) {
      return second.asymmetricMatch(second);
    }
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
    }have identical properties AND methods with same names as:\n${INDENT_ALL(
      EXPECTED_COLOR(prettyFormat(expected)),
    )}\nbut ${
      inverse ? "they were identical:" : "instead received:"
    }\n${INDENT_ALL(RECEIVED_COLOR(prettyFormat(received)))}`;
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
    return `Traitfully${this.inverse ? "Not" : ""}SameAs<${prettyFormat(
      this.sample,
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
