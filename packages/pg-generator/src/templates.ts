import type { TemplateProvider, FKParams } from "@yeti/generator";

/**
 * PostgreSQL SQL templates.
 * All identifier parameters (namespace, name, fieldName, etc.) are
 * expected to be pre-quoted by the caller via dialect.quoteIdentifier().
 */
export class PostgresTemplates implements TemplateProvider {
  schema(namespace: string): string {
    return `CREATE SCHEMA IF NOT EXISTS ${namespace};`;
  }

  enum(namespace: string, name: string, values: string): string {
    return `CREATE TYPE ${namespace}.${name} AS ENUM (${values});`;
  }

  table(namespace: string, name: string, columns: string): string {
    return `CREATE TABLE ${namespace}.${name} (\n  ${columns}\n);`;
  }

  uniqueIndex(namespace: string, tableName: string, fieldName: string): string {
    return (
      `CREATE UNIQUE INDEX ${fieldName} ` +
      `ON ${namespace}.${tableName} (${fieldName});`
    );
  }

  foreignKey(params: FKParams): string {
    const { namespace, tableName, fieldName, targetTable, targetColumn } =
      params;
    return (
      `ALTER TABLE ${namespace}.${tableName} ` +
      `ADD CONSTRAINT ${fieldName} ` +
      `FOREIGN KEY (${fieldName}) ` +
      `REFERENCES ${namespace}.${targetTable} (${targetColumn}) ` +
      `ON DELETE SET NULL;`
    );
  }
}
