import type { Attribute } from "@yeti/parse";

export interface SQLDialect {
  readonly name: string;
  readonly typeMap: Map<string, string>;
  readonly quoteIdentifier: (id: string) => string;
  readonly serialType: string;

  // method to let dialects handle their own constraints
  generateConstraint(attr: Attribute, fieldType: string): string | null;
}

export interface TemplateProvider {
  schema: (namespace: string) => string;
  enum: (namespace: string, name: string, values: string) => string;
  table: (namespace: string, name: string, columns: string) => string;
  uniqueIndex: (
    namespace: string,
    tableName: string,
    fieldName: string
  ) => string;
  foreignKey: (params: FKParams) => string;
}

export interface FKParams {
  namespace: string;
  tableName: string;
  fieldName: string;
  targetTable: string;
  targetColumn: string;
}
