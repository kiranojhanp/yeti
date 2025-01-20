import type { TemplateProvider, FKParams } from "@yeti/generator";

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
      `CREATE UNIQUE INDEX "${tableName}_${fieldName}_unique_idx" ` +
      `ON ${namespace}.${tableName} ("${fieldName}");`
    );
  }

  foreignKey(params: FKParams): string {
    const { namespace, tableName, fieldName, targetTable, targetColumn } =
      params;
    return (
      `ALTER TABLE ${namespace}.${tableName} ` +
      `ADD CONSTRAINT "${tableName}_${fieldName}_fk" ` +
      `FOREIGN KEY ("${fieldName}") ` +
      `REFERENCES ${namespace}.${targetTable} ("${targetColumn}") ` +
      `ON DELETE RESTRICT;`
    );
  }
}
