import { describe, test, expect } from "vitest";
import { YetiParser } from "../parse";

describe("boundary / edge-case parsing", () => {
  test("entity as last line does not crash", () => {
    const input = `
namespace app:
  entity Empty:
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(1);
    expect(result[0].entities).toHaveLength(1);
    expect(result[0].entities[0].name).toBe("Empty");
    expect(result[0].entities[0].fields).toEqual([]);
  });

  test("enum as last line does not crash", () => {
    const input = `
namespace app:
  enum Color:
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(1);
    expect(result[0].enums).toHaveLength(1);
    expect(result[0].enums[0].name).toBe("Color");
    expect(result[0].enums[0].values).toEqual([]);
  });

  test("empty entity does not consume sibling entity", () => {
    const input = `
namespace app:
  entity Empty:
  entity Real:
    id: number
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(1);
    expect(result[0].entities).toHaveLength(2);
    expect(result[0].entities[0].name).toBe("Empty");
    expect(result[0].entities[0].fields).toEqual([]);
    expect(result[0].entities[1].name).toBe("Real");
    expect(result[0].entities[1].fields).toHaveLength(1);
    expect(result[0].entities[1].fields[0].name).toBe("id");
  });

  test("empty enum does not consume sibling enum", () => {
    const input = `
namespace app:
  enum Empty:
  enum Color:
    red
    blue
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(1);
    expect(result[0].enums).toHaveLength(2);
    expect(result[0].enums[0].name).toBe("Empty");
    expect(result[0].enums[0].values).toEqual([]);
    expect(result[0].enums[1].name).toBe("Color");
    expect(result[0].enums[1].values).toEqual(["red", "blue"]);
  });
});
