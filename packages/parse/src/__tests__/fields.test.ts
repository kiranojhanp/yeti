import { describe, test, expect } from "vitest";
import { YetiParser } from "../parse";

describe("field and attribute parsing", () => {
  test("field with colon in default value", () => {
    const input = `
namespace app:
  entity Config:
    url: string @default(https://example.com)
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    const field = result[0].entities[0].fields[0];
    expect(field.name).toBe("url");
    expect(field.type).toBe("string");
    expect(field.attributes).toHaveLength(1);
    expect(field.attributes[0].name).toBe("default");
    expect(field.attributes[0].params).toEqual(["https://example.com"]);
  });

  test("attribute with nested parens like @default(now())", () => {
    const input = `
namespace app:
  entity Event:
    created_at: timestamp @default(now())
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    const field = result[0].entities[0].fields[0];
    expect(field.name).toBe("created_at");
    expect(field.type).toBe("timestamp");
    expect(field.attributes).toHaveLength(1);
    expect(field.attributes[0].name).toBe("default");
    expect(field.attributes[0].params).toEqual(["now()"]);
  });

  test("names are trimmed of whitespace", () => {
    const input = `
namespace  myns :
  entity  MyEntity :
    name: string
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result[0].name).toBe("myns");
    expect(result[0].entities[0].name).toBe("MyEntity");
  });

  test("empty field name reports parse error", () => {
    const input = `
namespace app:
  entity Bad:
    : string
`.trim();

    const parser = new YetiParser(input);
    const result = parser.parse();

    expect(result.errors.length).toBeGreaterThan(0);
  });

  test("empty field type reports parse error", () => {
    const input = `
namespace app:
  entity Bad:
    name:
`.trim();

    const parser = new YetiParser(input);
    const result = parser.parse();

    expect(result.errors.length).toBeGreaterThan(0);
  });

  test("@pk() empty parens produces empty params array", () => {
    const input = `
namespace app:
  entity Item:
    id: number @pk()
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    const attr = result[0].entities[0].fields[0].attributes[0];
    expect(attr.name).toBe("pk");
    expect(attr.params).toEqual([]);
  });
});
