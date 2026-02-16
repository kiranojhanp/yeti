import type { Attribute, Entity, Enum, Field, Namespace } from "./types";

// Constants and Types
const PATTERNS = {
  NAMESPACE: /^namespace\s+([^:]+):/,
  ENTITY: /^entity\s+([^:]+):/,
  ENUM: /^enum\s+([^:]+):/,
  ATTRIBUTE: /^([^\(]+)(?:\((.*)\))?/,
} as const;

// Separate error messages for better maintenance
const ERRORS = {
  INVALID_LINE: (line: string) => `Invalid line format: "${line}"`,
  INVALID_DECLARATION: (type: string, line: number) =>
    `Invalid ${type} declaration on line ${line + 1}`,
  INVALID_ATTRIBUTE: (attr: string) => `Invalid attribute: @${attr}`,
} as const;

/**
 * YetiParser: Parses structured data definitions into typed objects
 *
 * Features:
 * - Namespace, entity, and enum parsing
 * - Attribute handling with priority ordering
 * - Comment support (#)
 * - Indentation-based structure
 */
export class YetiParser {
  // --- Configuration ---
  private static readonly ATTRIBUTE_PRIORITIES = new Map([
    ["pk", 1], // Primary keys first
    ["unique", 2], // Then constraints
    ["default", 3], // Then defaults
    ["fk", 4], // Foreign keys last
  ]);

  // --- State ---
  private readonly lines: string[];
  private currentIndex: number = 0;

  constructor(input: string) {
    // Remove empty lines during initialization
    this.lines = input.split("\n").filter((line) => line.trim());
  }

  // --- Public API ---
  /**
   * Parse the entire input into a structured format
   * @returns Array of parsed namespaces
   */
  public parse(): Namespace[] {
    const namespaces: Namespace[] = [];

    while (this.hasMoreLines()) {
      const line = this.peekLine();

      if (line.startsWith("namespace")) {
        namespaces.push(this.parseNamespace());
      } else {
        this.nextLine(); // Skip non-namespace lines
      }
    }

    return namespaces;
  }

  // --- Core Parsing Methods ---
  /**
   * Parse a namespace and its contents
   */
  private parseNamespace(): Namespace {
    const name = this.extractMatch(PATTERNS.NAMESPACE, "namespace");
    this.nextLine(); // advance past declaration line

    const namespace: Namespace = {
      name,
      entities: [],
      enums: [],
    };

    if (!this.hasMoreLines()) return namespace;
    const baseIndent = this.getCurrentIndentation();

    while (this.shouldContinueBlock(baseIndent)) {
      const line = this.peekLine().trim();

      if (this.isComment(line)) {
        this.nextLine();
        continue;
      }

      if (line.startsWith("entity")) {
        namespace.entities.push(this.parseEntity());
      } else if (line.startsWith("enum")) {
        namespace.enums.push(this.parseEnum());
      } else {
        this.nextLine();
      }
    }

    return namespace;
  }

  /**
   * Parse an entity definition
   */
  private parseEntity(): Entity {
    const name = this.extractMatch(PATTERNS.ENTITY, "entity");
    const fields: Field[] = [];
    const declLine = this.peekLine(); // save for indent comparison
    this.nextLine();
    if (!this.hasMoreLines()) return { name, fields };
    const declIndent = this.getIndentation(declLine);
    const baseIndent = this.getCurrentIndentation();
    if (baseIndent <= declIndent) return { name, fields }; // empty entity — next line is sibling

    while (this.shouldContinueBlock(baseIndent)) {
      const line = this.peekLine().trim();

      if (!this.isComment(line)) {
        fields.push(this.parseField(line));
      }

      this.nextLine();
    }

    return { name, fields };
  }

  /**
   * Parse an enum definition
   */
  private parseEnum(): Enum {
    const name = this.extractMatch(PATTERNS.ENUM, "enum");
    const values: string[] = [];
    const declLine = this.peekLine(); // save for indent comparison
    this.nextLine();
    if (!this.hasMoreLines()) return { name, values };
    const declIndent = this.getIndentation(declLine);
    const baseIndent = this.getCurrentIndentation();
    if (baseIndent <= declIndent) return { name, values }; // empty enum — next line is sibling

    while (this.shouldContinueBlock(baseIndent)) {
      const line = this.peekLine().trim();

      if (!this.isComment(line)) {
        values.push(line.replace(/#.*$/, "").trim());
      }

      this.nextLine();
    }

    return { name, values };
  }

  // --- Field and Attribute Parsing ---
  /**
   * Parse a field definition including its attributes
   */
  private parseField(line: string): Field {
    const stripped = line.replace(/#.*$/, "").trim();
    const [name, typeSection] = this.splitDefinition(stripped);
    const [type, ...attributesRaw] = typeSection
      .split("@")
      .map((s) => s.trim());

    const attributes = this.parseAndSortAttributes(attributesRaw);

    return { name, type, attributes };
  }

  /**
   * Parse a single attribute and its parameters
   */
  private parseAttribute(attr: string): Attribute {
    const trimmed = attr.trim();
    const parenIdx = trimmed.indexOf("(");
    if (parenIdx === -1) {
      return { name: trimmed, params: [] };
    }
    const name = trimmed.substring(0, parenIdx).trim();
    const lastParen = trimmed.lastIndexOf(")");
    const paramStr = trimmed.substring(
      parenIdx + 1,
      lastParen > parenIdx ? lastParen : trimmed.length
    );
    // For now, simple URL handling.
    // TODO: URL parsing is intentionally limited to `protocol://domain` or `protocol://domain.tld`.
    // Paths (e.g. `/foo/bar`), query strings, ports, userinfo, and fragments are not supported and will fail to parse.
    const params = paramStr ? paramStr.split(",").map((s) => s.trim()) : [];
    return { name, params };
  }

  /**
   * Parse and sort multiple attributes by priority
   */
  private parseAndSortAttributes(attributes: string[]): Attribute[] {
    const parsed = attributes.map((attr) => this.parseAttribute(attr));

    return parsed.sort((a, b) => {
      const priorityA = YetiParser.ATTRIBUTE_PRIORITIES.get(a.name) ?? 999;
      const priorityB = YetiParser.ATTRIBUTE_PRIORITIES.get(b.name) ?? 999;
      return priorityA - priorityB;
    });
  }

  // --- Helper Methods ---
  private getCurrentIndentation(): number {
    return this.getIndentation(this.peekLine());
  }

  private shouldContinueBlock(baseIndent: number): boolean {
    return (
      this.hasMoreLines() && this.getIndentation(this.peekLine()) >= baseIndent
    );
  }

  private isComment(line: string): boolean {
    return line.startsWith("#");
  }

  private extractMatch(pattern: RegExp, type: string): string {
    const line = this.lines[this.currentIndex].trim();
    const match = line.match(pattern);

    if (!match) {
      throw new Error(ERRORS.INVALID_DECLARATION(type, this.currentIndex));
    }

    return match[1].trim();
  }

  private splitDefinition(line: string): [string, string] {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      throw new Error(ERRORS.INVALID_LINE(line));
    }
    const name = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 1).trim();
    if (!name || !value) {
      throw new Error(ERRORS.INVALID_LINE(line));
    }
    return [name, value];
  }

  // --- Iterator Methods ---
  private hasMoreLines(): boolean {
    return this.currentIndex < this.lines.length;
  }

  private peekLine(): string {
    return this.lines[this.currentIndex];
  }

  private nextLine(): string {
    if (!this.hasMoreLines()) return "";
    return this.lines[this.currentIndex++];
  }

  private getIndentation(line: string): number {
    return line.search(/\S/);
  }
}
