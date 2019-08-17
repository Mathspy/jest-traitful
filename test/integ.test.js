require("../dist/jest-traitful.cjs");

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

  test("traitfully", () => {
    expect({ a: 1, b: "test", x: () => {} }).toEqualTraitfully({
      a: 1,
      b: "test",
      x: () => {},
    });
    expect({ a: 1, b: "test", x: () => {} }).not.toEqualTraitfully({
      a: 1,
      b: "test",
      y: () => {},
    });

    expect({ a: 1, b: "test", x: () => {} }).toEqual(
      expect.traitfully({
        a: 1,
        b: "test",
        x: () => {},
      }),
    );
    expect({ a: 1, b: "test", x: () => {} }).toEqual(
      expect.not.traitfully({
        a: 1,
        b: "test",
        y: () => {},
      }),
    );
  });
});
