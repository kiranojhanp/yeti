import { describe, it, expect } from "vitest";
import { PostgresDialect } from "../dialect";
import { PostgresGenerator } from "../index";
import type { Namespace } from "@yeti/parse";

describe("SQL Injection Prevention", () => {
  const dialect = new PostgresDialect();

  describe("quoteIdentifier", () => {
    it("quotes normal identifiers", () => {
      expect(dialect.quoteIdentifier("users")).toBe('"users"');
    });

    it("quotes reserved words", () => {
      expect(dialect.quoteIdentifier("user")).toBe('"user"');
      expect(dialect.quoteIdentifier("order")).toBe('"order"');
      expect(dialect.quoteIdentifier("select")).toBe('"select"');
    });

    it("escapes embedded double quotes", () => {
      expect(dialect.quoteIdentifier('my"col')).toBe('"my""col"');
    });

    it("escapes multiple embedded double quotes", () => {
      expect(dialect.quoteIdentifier('a"b"c')).toBe('"a""b""c"');
    });
  });

  describe("generateDefaultConstraint", () => {
    it("handles now() as CURRENT_TIMESTAMP", () => {
      expect(dialect.generateDefaultConstraint("now()")).toBe(
        "DEFAULT CURRENT_TIMESTAMP"
      );
    });

    it("handles numeric values without quotes", () => {
      expect(dialect.generateDefaultConstraint("0")).toBe("DEFAULT 0");
      expect(dialect.generateDefaultConstraint("42")).toBe("DEFAULT 42");
      expect(dialect.generateDefaultConstraint("3.14")).toBe("DEFAULT 3.14");
    });

    it("handles boolean values without quotes", () => {
      expect(dialect.generateDefaultConstraint("true")).toBe("DEFAULT true");
      expect(dialect.generateDefaultConstraint("false")).toBe("DEFAULT false");
    });

    it("handles string values with proper quoting", () => {
      expect(dialect.generateDefaultConstraint("hello")).toBe(
        "DEFAULT 'hello'"
      );
    });

    it("escapes single quotes in string defaults", () => {
      expect(dialect.generateDefaultConstraint("it's")).toBe("DEFAULT 'it''s'");
    });

    it("handles malicious SQL injection attempts", () => {
      const malicious = "'; DROP TABLE users; --";
      const result = dialect.generateDefaultConstraint(malicious);
      expect(result).toBe("DEFAULT '''; DROP TABLE users; --'");
    });

    it("returns null for undefined", () => {
      expect(dialect.generateDefaultConstraint(undefined)).toBeNull();
    });

    it("returns null for null", () => {
      expect(
        dialect.generateDefaultConstraint(null as unknown as string | undefined)
      ).toBeNull();
    });
  });

  describe("enum value escaping", () => {
    it("escapes single quotes in enum values via full generation", () => {
      const generator = new PostgresGenerator();
      const ast: Namespace[] = [
        {
          name: "public",
          entities: [],
          enums: [
            {
              name: "status",
              values: ["it's", "they're", "normal"],
            },
          ],
        },
      ];

      const sql = generator.generateSQL(ast);
      expect(sql).toContain("'it''s'");
      expect(sql).toContain("'they''re'");
      expect(sql).toContain("'normal'");
    });
  });
});
