import { describe, test, expect } from "vitest";
import { YetiParser } from "../parse";

describe("comment handling", () => {
  test("inline comment is stripped from field type", () => {
    const input = `
namespace app:
  entity User:
    name: string # the user's name
`.trim();

    const parser = new YetiParser(input);
    const result = parser.parse();

    const field = result[0].entities[0].fields[0];
    expect(field.type).toBe("string");
  });

  test("inline comment is stripped from enum values", () => {
    const input = `
namespace app:
  enum Status:
    active # the active state
    inactive # the inactive state
`.trim();

    const parser = new YetiParser(input);
    const result = parser.parse();

    expect(result[0].enums[0].values).toEqual(["active", "inactive"]);
  });

  test("full-line comments are skipped", () => {
    const input = `
namespace app:
  # this is a comment
  entity User:
    # another comment
    id: number
`.trim();

    const parser = new YetiParser(input);
    const result = parser.parse();

    expect(result[0].entities).toHaveLength(1);
    expect(result[0].entities[0].fields).toHaveLength(1);
    expect(result[0].entities[0].fields[0].name).toBe("id");
  });

  test("@pk() has empty params array (not [''])", () => {
    const input = `
namespace app:
  entity Item:
    id: number @pk()
`.trim();

    const parser = new YetiParser(input);
    const result = parser.parse();

    const attr = result[0].entities[0].fields[0].attributes[0];
    expect(attr.params).toEqual([]);
    expect(attr.params).not.toEqual([""]);
  });
});
