import type { Attribute } from "@yeti/parse";
import type { SQLDialect } from "@yeti/generator";

/**
 * PostgreSQL-specific implementation
 */
export class PostgresDialect implements SQLDialect {
  readonly name = "PostgreSQL";
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

  generateConstraint(attr: Attribute, _fieldType: string): string | null {
    switch (attr.name) {
      case "pk":
        return "PRIMARY KEY";
      case "unique":
        return "UNIQUE";
      case "default":
        const value = attr.params?.[0];
        if (!value) return null;
        return this.generateDefaultConstraint(value);
      default:
        return null;
    }
  }

  generateDefaultConstraint(value: string | undefined): string | null {
    if (value === undefined || value === null) return null;
    if (value === "now()") return "DEFAULT CURRENT_TIMESTAMP";
    if (/^\d+(\.\d+)?$/.test(value)) return `DEFAULT ${value}`;
    if (value === "true" || value === "false") return `DEFAULT ${value}`;
    return `DEFAULT '${value.replace(/'/g, "''")}'`;
  }

  quoteIdentifier(id: string): string {
    return `"${id.replace(/"/g, '""')}"`;
  }
}
