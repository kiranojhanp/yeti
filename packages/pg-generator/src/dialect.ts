import type { Attribute } from "@yeti/parse";
import type { SQLDialect } from "@yeti/generator";

/**
 * PostgreSQL-specific implementation
 */
export class PostgresDialect implements SQLDialect {
  readonly name = "PostgreSQL";
  readonly defaultNowFn = "CURRENT_TIMESTAMP";
  readonly serialType = "SERIAL";

  readonly typeMap = new Map([
    ["integer", "INTEGER"],
    ["varchar", "VARCHAR(255)"],
    ["text", "TEXT"],
    ["timestamp", "TIMESTAMP"],
    ["boolean", "BOOLEAN"],
    ["float", "FLOAT"],
    ["decimal", "DECIMAL"],
    ["json", "JSONB"],
  ]);

  generateConstraint(attr: Attribute): string | null {
    switch (attr.name) {
      case "pk":
        return "PRIMARY KEY";
      case "unique":
        return "UNIQUE";
      case "default":
        const value = attr.params?.[0];
        if (!value) return null;
        return this.generateDefaultConstraint(attr.params?.[0]);
      default:
        return null;
    }
  }

  generateDefaultConstraint(value: string | undefined): string {
    if (!value) return "";
    return value === "now()" ? "DEFAULT CURRENT_TIMESTAMP" : `DEFAULT ${value}`;
  }

  quoteIdentifier(id: string): string {
    return `"${id}"`;
  }
}
