import prettyFormatInner from "pretty-format";

const {
  AsymmetricMatcher,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent,
} = prettyFormatInner.plugins;

const PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher,
];

export const prettyFormat = (obj, opts = {}) => {
  let result;
  try {
    result = prettyFormatInner(obj, { ...opts, plugins: PLUGINS });
  } catch (e) {
    result = prettyFormatInner(obj, {
      ...opts,
      callToJSON: false,
      plugins: PLUGINS,
    });
  }

  return result;
};

export const INDENT_ALL = str => str.replace(/^/gm, "  ");
