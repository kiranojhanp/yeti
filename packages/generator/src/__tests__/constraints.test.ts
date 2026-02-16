import { describe, it, expect } from "vitest";
import { BaseSQLGenerator } from "../base";
import type { SQLDialect, TemplateProvider, FKParams } from "../types";
import type { Attribute, Namespace } from "@yeti/parse";

// Minimal test dialect
const testDialect: SQLDialect = {
  name: "test",
  typeMap: new Map([
    ["integer", "INTEGER"],
    ["varchar", "VARCHAR(255)"],
    ["serial", "SERIAL"],
  ]),
  serialType: "SERIAL",
  quoteIdentifier: (id: string) => `"${id}"`,
  generateConstraint(attr: Attribute, _fieldType: string): string | null {
    switch (attr.name) {
      case "pk":
        return "PRIMARY KEY";
      case "unique":
        return "UNIQUE";
      default:
        return null;
    }
  },
};

const testTemplates: TemplateProvider = {
  schema: (ns: string) => `CREATE SCHEMA IF NOT EXISTS ${ns};`,
  enum: (ns: string, name: string, values: string) =>
    `CREATE TYPE ${ns}.${name} AS ENUM (${values});`,
  table: (ns: string, name: string, columns: string) =>
    `CREATE TABLE ${ns}.${name} (\n  ${columns}\n);`,
  uniqueIndex: (ns: string, table: string, field: string) =>
    `CREATE UNIQUE INDEX "${table}_${field}_unique_idx" ON ${ns}.${table} ("${field}");`,
  // Templates expect pre-quoted identifiers from base.ts
  foreignKey: (params: FKParams) =>
    `ALTER TABLE ${params.namespace}.${params.tableName} ADD CONSTRAINT ${params.fieldName} FOREIGN KEY (${params.fieldName}) REFERENCES ${params.namespace}.${params.targetTable} (${params.targetColumn}) ON DELETE RESTRICT;`,
};

class TestGenerator extends BaseSQLGenerator {
  constructor() {
    super(testDialect, testTemplates);
  }

  protected supportsEnums(): boolean {
    return true;
  }
}

describe("Constraint Handling", () => {
  const generator = new TestGenerator();

  describe("FK with empty params", () => {
    it("does not crash when FK has empty params array", () => {
      const ast: Namespace[] = [
        {
          name: "public",
          entities: [
            {
              name: "posts",
              fields: [
                {
                  name: "id",
                  type: "serial",
                  attributes: [{ name: "pk", params: [] }],
                },
                {
                  name: "user_id",
                  type: "integer",
                  attributes: [{ name: "fk", params: [] }],
                },
              ],
            },
          ],
          enums: [],
        },
      ];

      // Should not throw
      expect(() => generator.generateSQL(ast)).not.toThrow();
    });

    it("generates FK when params are valid", () => {
      const ast: Namespace[] = [
        {
          name: "public",
          entities: [
            {
              name: "posts",
              fields: [
                {
                  name: "user_id",
                  type: "integer",
                  attributes: [{ name: "fk", params: ["> users.id"] }],
                },
              ],
            },
          ],
          enums: [],
        },
      ];

      const sql = generator.generateSQL(ast);
      expect(sql).toContain("FOREIGN KEY");
      expect(sql).toContain("REFERENCES");
    });
  });

  describe("Unique constraint dedup", () => {
    it("does not generate separate index for @unique field", () => {
      const ast: Namespace[] = [
        {
          name: "public",
          entities: [
            {
              name: "users",
              fields: [
                {
                  name: "email",
                  type: "varchar",
                  attributes: [{ name: "unique", params: [] }],
                },
              ],
            },
          ],
          enums: [],
        },
      ];

      const sql = generator.generateSQL(ast);
      // Inline UNIQUE should be present in column definition
      expect(sql).toContain("UNIQUE");
      // But no separate CREATE UNIQUE INDEX
      expect(sql).not.toContain("CREATE UNIQUE INDEX");
    });
  });
});
