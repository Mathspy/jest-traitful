require("../dist/jest-trailtful.cjs");

describe("All jest-traitful matchers should be there", () => {
  test("methodlessly", () => {
    expect({ a: 1, b: "test", x: () => {}, y: () => {} }).toEqualWithoutMethods(
      {
        a: 1,
        b: "test",
      },
    );

    expect({ a: 1, b: "test", x: () => {}, y: () => {} }).toEqual(
      expect.methodlessly({
        a: 1,
        b: "test",
      }),
    );
  });
});
