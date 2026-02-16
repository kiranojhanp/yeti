import type { SQLDialect, TemplateProvider } from "./types";
import type { Entity, Enum, Field, Namespace } from "@yeti/parse";

/**
 * Abstract base class for SQL generators
 * Handles common logic while allowing dialect-specific customization
 */
export abstract class BaseSQLGenerator {
  protected namespace: string = "";
  protected enums: Map<string, Enum> = new Map();

  constructor(
    protected readonly dialect: SQLDialect,
    protected readonly templates: TemplateProvider
  ) {}

  // --- Public API ---
  public generateSQL(ast: Namespace[]): string {
    const sqlParts: string[] = [];

    for (const namespace of ast) {
      sqlParts.push(...this.generateNamespaceSQL(namespace));
    }

    return sqlParts.join("\n");
  }

  // --- Protected Template Methods ---
  protected createSchema(namespace: string): string {
    const qNamespace = this.dialect.quoteIdentifier(namespace);
    return this.templates.schema(qNamespace);
  }

  protected createEnum(enumDef: Enum): string {
    const values = this.formatEnumValues(enumDef.values);
    const qNamespace = this.dialect.quoteIdentifier(this.namespace);
    const qName = this.dialect.quoteIdentifier(enumDef.name);
    return this.templates.enum(qNamespace, qName, values);
  }

  protected createTable(entity: Entity): string {
    const columns = entity.fields
      .map((field) => this.generateColumnDefinition(field))
      .join(",\n  ");

    const qNamespace = this.dialect.quoteIdentifier(this.namespace);
    const qName = this.dialect.quoteIdentifier(entity.name);
    return this.templates.table(qNamespace, qName, columns);
  }

  protected createIndexes(entity: Entity): string[] {
    return entity.fields.flatMap((field) =>
      this.generateFieldIndexes(entity.name, field)
    );
  }

  protected createForeignKeys(entity: Entity): string[] {
    return entity.fields.flatMap((field) =>
      this.generateFieldForeignKeys(entity.name, field)
    );
  }

  // --- Protected Helper Methods ---
  protected generateNamespaceSQL(namespace: Namespace): string[] {
    this.initializeNamespace(namespace);

    return [
      this.createSchema(namespace.name),
      "",
      ...this.generateEnumStatements(namespace.enums),
      ...this.generateTableStatements(namespace.entities),
      ...this.generateForeignKeyStatements(namespace.entities),
    ];
  }

  protected generateColumnDefinition(field: Field): string {
    const parts = [
      this.dialect.quoteIdentifier(field.name),
      this.resolveFieldType(field.type),
    ];

    field.attributes.forEach((attr) => {
      const constraint = this.dialect.generateConstraint(attr, field.type);
      if (constraint) parts.push(constraint);
    });

    return parts.join(" ");
  }

  // --- Abstract Methods for Dialect-Specific Behavior ---
  protected abstract supportsEnums(): boolean;

  // --- Private Helper Methods ---
  private initializeNamespace(namespace: Namespace): void {
    this.namespace = namespace.name;
    this.enums.clear();
    namespace.enums.forEach((enum_) => {
      this.enums.set(enum_.name, enum_);
    });
  }

  private generateEnumStatements(enums: Enum[]): string[] {
    if (!this.supportsEnums() || enums.length === 0) return [];

    return enums.flatMap((enum_) => [this.createEnum(enum_), ""]);
  }

  private generateTableStatements(entities: Entity[]): string[] {
    return entities.flatMap((entity) => [
      this.createTable(entity),
      "",
      ...this.generateTableIndexes(entity),
    ]);
  }

  private generateTableIndexes(entity: Entity): string[] {
    const indexes = this.createIndexes(entity);
    return indexes.length > 0 ? [...indexes, ""] : [];
  }

  private generateForeignKeyStatements(entities: Entity[]): string[] {
    return entities.flatMap((entity) => {
      const foreignKeys = this.createForeignKeys(entity);
      return foreignKeys.length > 0 ? [...foreignKeys, ""] : [];
    });
  }

  private generateFieldIndexes(tableName: string, field: Field): string[] {
    // Unique constraint is handled inline by dialect.generateConstraint()
    // No separate indexes needed
    return [];
  }

  private generateFieldForeignKeys(tableName: string, field: Field): string[] {
    return field.attributes
      .filter(
        (attr) => attr.name === "fk" && attr.params && attr.params.length > 0
      )
      .map((attr) =>
        this.parseForeignKey(tableName, field.name, attr.params![0])
      );
  }

  private parseForeignKey(
    tableName: string,
    fieldName: string,
    reference: string
  ): string {
    // NOTE: Currently assumes FK target is in the same namespace.
    // Cross-namespace FK references (e.g., "> other_schema.users.id") are not supported.
    const match = reference.match(/>\s*([^.]+)\.(.+)/);
    if (!match) {
      throw new Error(`Invalid foreign key reference: ${reference}`);
    }

    const [_, targetTable, targetColumn] = match;
    // Pre-quote all identifiers before passing to template
    return this.templates.foreignKey({
      namespace: this.dialect.quoteIdentifier(this.namespace),
      tableName: this.dialect.quoteIdentifier(tableName),
      fieldName: this.dialect.quoteIdentifier(fieldName),
      targetTable: this.dialect.quoteIdentifier(targetTable),
      targetColumn: this.dialect.quoteIdentifier(targetColumn),
    });
  }

  private resolveFieldType(type: string): string {
    if (type.toLowerCase() === "serial") {
      return this.dialect.serialType;
    }

    if (this.enums.has(type)) {
      return this.supportsEnums()
        ? `${this.dialect.quoteIdentifier(this.namespace)}.${this.dialect.quoteIdentifier(type)}`
        : this.dialect.typeMap.get("enum") || "VARCHAR(255)";
    }
    return this.dialect.typeMap.get(type.toLowerCase()) || type.toUpperCase();
  }

  private formatEnumValues(values: string[]): string {
    return values.map((v) => `'${v.replace(/'/g, "''")}'`).join(", ");
  }
}
