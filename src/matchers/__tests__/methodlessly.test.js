import methodlessly from "../methodlessly";

expect.extend(methodlessly.symmetric);
delete expect.toEqualWithoutMethods;
delete expect.not.toEqualWithoutMethods;
Object.entries(methodlessly.asymmetric).forEach(([name, Class]) => {
  expect[name] = expected => new Class(expected, false);
  expect.not[name] = expected => new Class(expected, true);
});

describe("methodlessly", () => {
  describe("symmetric", () => {
    it("can compare primitive values apparently!", () => {
      expect(true).toEqualWithoutMethods(true);
      expect("Mathy").toEqualWithoutMethods("Mathy");
      expect(123456).toEqualWithoutMethods(123456);
      expect(null).toEqualWithoutMethods(null);
    });

    it("can compare compare objects that have identical props correctly", () => {
      expect({ a: 1 }).toEqualWithoutMethods({ a: 1 });
      expect({ a: 1 }).not.toEqualWithoutMethods({ a: 2 });
      expect({ b: 1 }).not.toEqualWithoutMethods({ a: 1 });

      expect({ a: 1, b: "test" }).toEqualWithoutMethods({ a: 1, b: "test" });
      expect({ a: 1, b: "test" }).not.toEqualWithoutMethods({
        a: 1,
        b: "test",
        c: "fail",
      });
    });

    it("will remove methods from both objects before comparing them", () => {
      expect({ a: 1, x: () => {} }).toEqualWithoutMethods({
        a: 1,
        x: () => {},
      });
      expect({ a: 1, b: "test" }).toEqualWithoutMethods({
        a: 1,
        b: "test",
        x: () => {},
      });
      expect({
        a: 1,
        b: "test",
        x: () => {},
        y: () => {},
      }).toEqualWithoutMethods({
        a: 1,
        b: "test",
      });

      expect({
        a: 1,
        b: "test",
        x: () => {},
      }).toEqualWithoutMethods({
        a: 1,
        b: "test",
        y: () => {},
      });
      expect({ a: 5, x: () => {} }).not.toEqualWithoutMethods({
        a: 1,
        x: () => {},
      });
    });
  });

  describe("asymmetric", () => {
    it("can compare primitive values apparently!", () => {
      expect(true).toEqualWithoutMethods(true);
      expect("Mathy").toEqualWithoutMethods("Mathy");
      expect(123456).toEqualWithoutMethods(123456);
      expect(null).toEqualWithoutMethods(null);
    });

    it("can compare compare objects that have identical props correctly", () => {
      expect({ a: 1 }).toEqual(expect.methodlessly({ a: 1 }));
      expect({ a: 1 }).toEqual(expect.not.methodlessly({ a: 2 }));
      expect({ b: 1 }).toEqual(expect.not.methodlessly({ a: 1 }));

      expect({ a: 1, b: "test" }).toEqual(
        expect.methodlessly({ a: 1, b: "test" }),
      );
      expect({ a: 1, b: "test" }).toEqual(
        expect.not.methodlessly({
          a: 1,
          b: "test",
          c: "fail",
        }),
      );
    });

    it("will remove methods from both objects before comparing them", () => {
      expect({ a: 1, x: () => {} }).toEqual(
        expect.methodlessly({ a: 1, x: () => {} }),
      );
      expect({ a: 1, b: "test" }).toEqual(
        expect.methodlessly({
          a: 1,
          b: "test",
          x: () => {},
        }),
      );
      expect({ a: 1, b: "test", x: () => {}, y: () => {} }).toEqual(
        expect.methodlessly({
          a: 1,
          b: "test",
        }),
      );

      expect({ a: 1, b: "test", x: () => {} }).toEqual(
        expect.methodlessly({
          a: 1,
          b: "test",
          y: () => {},
        }),
      );
      expect({ a: 5, x: () => {} }).toEqual(
        expect.not.methodlessly({ a: 1, x: () => {} }),
      );
    });

    it("will function if some or all of the properties are other asymmetric matchers", () => {
      expect({ a: 1, x: () => {} }).toEqual(
        expect.methodlessly({ a: expect.anything(), x: () => {} }),
      );

      expect({ a: 1, x: () => {} }).toEqual(
        expect.methodlessly({ a: 1, x: expect.any(Function) }),
      );

      expect({ a: { m: 5, n: 6 }, x: () => {} }).toEqual(
        expect.methodlessly({
          a: expect.objectContaining({ m: 5 }),
          y: () => {},
        }),
      );

      expect({ a: 1, x: () => {} }).toEqual(
        expect.methodlessly({
          a: expect.anything(),
          x: expect.any(Function),
        }),
      );

      expect({ a: 1, x: () => {} }).not.toEqual(
        expect.methodlessly({
          a: expect.anything(),
          x: expect.any(Function),
          y: expect.any(Function),
        }),
      );
      expect({ a: 1, x: () => {} }).not.toEqual(
        expect.methodlessly({
          a: expect.any(String),
          x: expect.any(Function),
        }),
      );
      expect({ a: { m: 5, n: 6 }, x: () => {} }).not.toEqual(
        expect.methodlessly({
          a: expect.objectContaining({ z: 5 }),
          y: () => {},
        }),
      );
    });
  });
});
