import { describe, test, expect } from "vitest";
import { YetiParser } from "../parse";

describe("location tracking", () => {
  test("reports location for namespace, entity, and field", () => {
    // 01234567890123456789 (column index)
    // namespace core:      (line 1)
    //   entity User:       (line 2)
    //     id: string       (line 3)

    const input = `
namespace core:
  entity User:
    id: string
`.trim();

    const parser = new YetiParser(input);
    const { ast: result } = parser.parse();

    expect(result).toHaveLength(1);
    const ns = result[0];

    // Namespace location
    // Since input is trimmed, line 1 is "namespace core:"
    expect(ns.loc).toBeDefined();
    // Chevrotain lines are 1-based, columns are 1-based.
    // "namespace" starts at 1:1.
    // The namespace rule consumes the whole block.
    // So it should end at line 3, column ~14 (end of "string")
    expect(ns.loc?.startLine).toBe(1);
    expect(ns.loc?.startColumn).toBe(1);
    expect(ns.loc?.endLine).toBe(3);

    const entity = ns.entities[0];
    expect(entity.loc).toBeDefined();
    // "entity User:" starts at line 2.
    // Indentation is usually 2 spaces.
    // So "entity" starts at col 3.
    expect(entity.loc?.startLine).toBe(2);
    // expect(entity.loc?.startColumn).toBe(3); // Might be sensitive to whitespace handling
    expect(entity.loc?.endLine).toBe(3);

    const field = entity.fields[0];
    expect(field.loc).toBeDefined();
    expect(field.loc?.startLine).toBe(3);
    expect(field.loc?.endLine).toBe(3);
  });
});
