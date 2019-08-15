import traitfully from "../traitfully";

expect.extend(traitfully.symmetric);
delete expect.toEqualWithoutMethods;
delete expect.not.toEqualWithoutMethods;
Object.entries(traitfully.asymmetric).forEach(([name, Class]) => {
  expect[name] = expected => new Class(expected, false);
  expect.not[name] = expected => new Class(expected, true);
});

describe("traitfully", () => {
  describe("symmetric", () => {
    it("can compare primitive values apparently!", () => {
      expect(true).toEqualTraitfully(true);
      expect("Mathy").toEqualTraitfully("Mathy");
      expect(123456).toEqualTraitfully(123456);
      expect(null).toEqualTraitfully(null);
    });

    it("can compare compare objects that have identical props correctly", () => {
      expect({ a: 1 }).toEqualTraitfully({ a: 1 });
      expect({ a: 1 }).not.toEqualTraitfully({ a: 2 });
      expect({ b: 1 }).not.toEqualTraitfully({ a: 1 });

      expect({ a: 1, b: "test" }).toEqualTraitfully({ a: 1, b: "test" });
      expect({ a: 1, b: "test" }).not.toEqualTraitfully({
        a: 1,
        b: "test",
        c: "fail",
      });
    });

    it("will ensure both objects have methods with same names", () => {
      expect({ a: 1, x: () => {} }).toEqualTraitfully({ a: 1, x: () => {} });
      expect({ a: 1, b: "test" }).not.toEqualTraitfully({
        a: 1,
        b: "test",
        x: () => {},
      });
      expect({
        a: 1,
        b: "test",
        x: () => {},
        y: () => {},
      }).not.toEqualTraitfully({
        a: 1,
        b: "test",
      });

      expect({ a: 1, b: "test", x: () => {}, y: () => {} }).toEqualTraitfully({
        a: 1,
        b: "test",
        x: () => {},
        y: () => {},
      });
      expect({ a: 1, y: () => {} }).not.toEqualTraitfully({
        a: 1,
        x: () => {},
      });
      expect({ a: 5, x: () => {} }).not.toEqualTraitfully({
        a: 1,
        x: () => {},
      });
    });
  });

  describe("asymmetric", () => {
    it("can compare primitive values apparently!", () => {
      expect(true).toEqual(expect.traitfully(true));
      expect("Mathy").toEqual(expect.traitfully("Mathy"));
      expect(123456).toEqual(expect.traitfully(123456));
      expect(null).toEqual(expect.traitfully(null));
    });

    it("can compare compare objects that have identical props correctly", () => {
      expect({ a: 1 }).toEqual(expect.traitfully({ a: 1 }));
      expect({ a: 1 }).toEqual(expect.not.traitfully({ a: 2 }));
      expect({ b: 1 }).toEqual(expect.not.traitfully({ a: 1 }));

      expect({ a: 1, b: "test" }).toEqual(
        expect.traitfully({ a: 1, b: "test" }),
      );
      expect({ a: 1, b: "test" }).toEqual(
        expect.not.traitfully({
          a: 1,
          b: "test",
          c: "fail",
        }),
      );
    });

    it("will ensure both objects have methods with same names", () => {
      expect({ a: 1, x: () => {} }).toEqual(
        expect.traitfully({ a: 1, x: () => {} }),
      );
      expect({ a: 1, b: "test" }).toEqual(
        expect.not.traitfully({
          a: 1,
          b: "test",
          x: () => {},
        }),
      );
      expect({ a: 1, b: "test", x: () => {}, y: () => {} }).toEqual(
        expect.not.traitfully({
          a: 1,
          b: "test",
        }),
      );

      expect({ a: 1, b: "test", x: () => {}, y: () => {} }).toEqual(
        expect.traitfully({
          a: 1,
          b: "test",
          x: () => {},
          y: () => {},
        }),
      );
      expect({ a: 1, y: () => {} }).toEqual(
        expect.not.traitfully({ a: 1, x: () => {} }),
      );
      expect({ a: 5, x: () => {} }).toEqual(
        expect.not.traitfully({ a: 1, x: () => {} }),
      );
    });

    it("will function if some or all of the properties are other asymmetric matchers", () => {
      expect({ a: 1, x: () => {} }).toEqual(
        expect.traitfully({ a: expect.anything(), x: () => {} }),
      );

      expect({ a: 1, x: () => {} }).toEqual(
        expect.traitfully({ a: expect.anything(), x: expect.any(Function) }),
      );

      expect({ a: { m: 5, n: 6 }, x: () => {} }).toEqual(
        expect.traitfully({
          a: expect.objectContaining({ m: 5 }),
          x: expect.any(Function),
        }),
      );

      expect({ a: 1, x: () => {} }).not.toEqual(
        expect.traitfully({
          a: expect.anything(),
          x: expect.any(Function),
          y: expect.any(Function),
        }),
      );
    });
  });
});
