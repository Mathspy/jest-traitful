import matchers from "./matchers";

const jestExpect = global.expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers.symmetric);
  Object.keys(matchers.symmetric).forEach(matcher => {
    delete expect[matcher];
    delete expect.not[matcher];
  });
  Object.entries(matchers.asymmetric).forEach(([name, Class]) => {
    expect[name] = expected => new Class(expected, false);
    expect.not[name] = expected => new Class(expected, true);
  });
} else {
  // eslint-disable-next-line no-console
  console.error(
    "Unable to find Jest's global expect." +
      "\nPlease check you have added jest-traitful correctly to your jest configuration." +
      "\nSee https://github.com/jest-community/jest-traitful#setup for help.",
  );
}
