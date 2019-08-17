import _ from "lodash";
import {
  matcherHint,
  EXPECTED_COLOR,
  RECEIVED_COLOR,
} from "jest-matcher-utils";
import { prettyFormat, INDENT_ALL } from "../utils";

function withoutMethods(obj) {
  return _.cloneDeepWith(obj, function customizer(v) {
    if (v && v.$$typeof === Symbol.for("jest.asymmetricMatcher")) {
      return v;
    }

    if (_.isObject(v)) {
      return _.cloneDeepWith(_.omitBy(v, _.isFunction), _.after(2, customizer));
    }

    return undefined;
  });
}

function predicate(received, expected) {
  return _.isEqualWith(received, expected, function customizer(first, second) {
    if (_.isFunction(first) && (_.isFunction(second) || _.isNil(second))) {
      return true;
    }

    if (_.isFunction(second) && (_.isFunction(first) || _.isNil(first))) {
      return true;
    }

    if (first && first.$$typeof === Symbol.for("jest.asymmetricMatcher")) {
      return first.asymmetricMatch(second);
    }
    if (second && second.$$typeof === Symbol.for("jest.asymmetricMatcher")) {
      return second.asymmetricMatch(second);
    }

    if (_.isPlainObject(first) && _.isPlainObject(second)) {
      return _.transform(
        _.union(Object.keys(first), Object.keys(second)),
        (result, key) => {
          // This is how _.transform is meant to be used
          // eslint-disable-next-line no-return-assign, no-param-reassign
          return (result.current = predicate(first[key], second[key]));
        },
        { current: true },
      ).current;
    }

    return undefined;
  });
}

function message(received, expected, inverse) {
  return () =>
    `${matcherHint(
      `${inverse ? ".not" : ""}.toEqualWithoutMethods`,
      "received",
      "expected",
    )}\n\nExpected object without methods to${
      inverse ? " NOT " : " "
    }be the same as:\n${INDENT_ALL(
      EXPECTED_COLOR(prettyFormat(withoutMethods(expected))),
    )}\nbut ${inverse ? "it was the same:" : "instead received:"}\n${INDENT_ALL(
      RECEIVED_COLOR(prettyFormat(withoutMethods(received))),
    )}\nand original object was:\n${INDENT_ALL(
      RECEIVED_COLOR(prettyFormat(received)),
    )}`;
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
    return `WithoutMethods${this.inverse ? "Not" : ""}SameAs<${prettyFormat(
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
