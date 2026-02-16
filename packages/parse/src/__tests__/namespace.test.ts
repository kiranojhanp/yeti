import { describe, test, expect } from "vitest";
import { YetiParser } from "../parse";

describe("namespace parsing", () => {
  test("parses multiple namespaces independently", () => {
    const input = `
namespace auth:
  entity User:
    id: number @pk

namespace billing:
  entity Invoice:
    total: number
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(2);

    expect(result[0].name).toBe("auth");
    expect(result[0].entities).toHaveLength(1);
    expect(result[0].entities[0].name).toBe("User");
    expect(result[0].entities[0].fields).toHaveLength(1);
    expect(result[0].entities[0].fields[0].name).toBe("id");

    expect(result[1].name).toBe("billing");
    expect(result[1].entities).toHaveLength(1);
    expect(result[1].entities[0].name).toBe("Invoice");
    expect(result[1].entities[0].fields).toHaveLength(1);
    expect(result[1].entities[0].fields[0].name).toBe("total");
  });

  test("namespace with entities and enums", () => {
    const input = `
namespace core:
  entity Product:
    name: string

  enum Status:
    active
    inactive
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("core");
    expect(result[0].entities).toHaveLength(1);
    expect(result[0].entities[0].name).toBe("Product");
    expect(result[0].entities[0].fields[0].name).toBe("name");
    expect(result[0].enums).toHaveLength(1);
    expect(result[0].enums[0].name).toBe("Status");
    expect(result[0].enums[0].values).toEqual(["active", "inactive"]);
  });
});
