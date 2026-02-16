import { createToken, Lexer, CstParser, CstNode, IToken } from "chevrotain";
import { Namespace, Entity, Enum, Field, Attribute } from "./types";

// -----------------
// 1. Token Definitions
// -----------------

// Keywords
export const NamespaceKeyword = createToken({
  name: "NamespaceKeyword",
  pattern: /namespace/,
});
export const EntityKeyword = createToken({
  name: "EntityKeyword",
  pattern: /entity/,
});
export const EnumKeyword = createToken({
  name: "EnumKeyword",
  pattern: /enum/,
});
export const True = createToken({ name: "True", pattern: /true/ });
export const False = createToken({ name: "False", pattern: /false/ });

// Symbols
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const At = createToken({ name: "At", pattern: /@/ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const Dot = createToken({ name: "Dot", pattern: /\./ });
export const Slash = createToken({ name: "Slash", pattern: /\// }); // New Token

// Literals
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /'((?:[^'\\]|\\.)*)'/,
});
// Identifier (Must be after keywords)
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

// Comments & Whitespace
export const Comment = createToken({
  name: "Comment",
  pattern: /#[^\n\r]*/,
  group: "comments",
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// Token List (Order matters!)
export const allTokens = [
  WhiteSpace,
  Comment,
  NamespaceKeyword,
  EntityKeyword,
  EnumKeyword,
  True,
  False,
  Colon,
  LParen,
  RParen,
  Comma,
  At,
  GreaterThan,
  Dot,
  Slash,
  StringLiteral,
  Identifier,
];

// -----------------
// 2. Lexer
// -----------------
export const YetiLexer = new Lexer(allTokens);

// -----------------
// 3. Parser
// -----------------
export class YetiCstParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public parsedFile = this.RULE("parsedFile", () => {
    this.MANY(() => {
      this.SUBRULE(this.parsedNamespace);
    });
  });

  public parsedNamespace = this.RULE("parsedNamespace", () => {
    this.CONSUME(NamespaceKeyword);
    this.CONSUME(Identifier); // namespace name
    this.CONSUME(Colon);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.parsedEntity) },
        { ALT: () => this.SUBRULE(this.parsedEnum) },
      ]);
    });
  });

  public parsedEntity = this.RULE("parsedEntity", () => {
    this.CONSUME(EntityKeyword);
    this.CONSUME(Identifier); // entity name
    this.CONSUME(Colon);
    this.MANY(() => {
      this.SUBRULE(this.parsedField);
    });
  });

  public parsedEnum = this.RULE("parsedEnum", () => {
    this.CONSUME(EnumKeyword);
    this.CONSUME(Identifier); // enum name
    this.CONSUME(Colon);
    this.MANY(() => {
      this.CONSUME2(Identifier); // value
    });
  });

  public parsedField = this.RULE("parsedField", () => {
    this.CONSUME(Identifier); // field name
    this.CONSUME(Colon);
    this.CONSUME2(Identifier); // type name
    this.MANY(() => {
      this.SUBRULE(this.parsedAttribute);
    });
  });

  public parsedAttribute = this.RULE("parsedAttribute", () => {
    this.CONSUME(At);
    this.CONSUME(Identifier); // attribute name
    this.OPTION(() => {
      this.CONSUME(LParen);
      this.MANY_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.parsedParam),
      });
      this.CONSUME(RParen);
    });
  });

  public parsedParam = this.RULE("parsedParam", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      {
        ALT: () => {
          this.CONSUME(GreaterThan);
          this.CONSUME(Identifier); // Entity
          this.CONSUME(Dot);
          this.CONSUME2(Identifier); // Field
        },
      },
      // Handle ambiguous Identifier start (Simple ID, Function Call, URL)
      {
        ALT: () => {
          this.CONSUME3(Identifier);
          this.OPTION(() => {
            this.OR1([
              // Function Call: ident(...)
              {
                ALT: () => {
                  this.CONSUME(LParen);
                  this.MANY_SEP({
                    SEP: Comma,
                    DEF: () => this.SUBRULE(this.parsedParam),
                  });
                  this.CONSUME(RParen);
                },
              },
              // URL: protocol://domain...
              {
                ALT: () => {
                  this.CONSUME(Colon);
                  this.CONSUME(Slash);
                  this.CONSUME2(Slash);
                  this.CONSUME4(Identifier); // domain
                  this.OPTION2(() => {
                    this.CONSUME2(Dot);
                    this.CONSUME5(Identifier); // tld
                  });
                  // TODO: URL parsing is intentionally limited to `protocol://domain` or `protocol://domain.tld`.
                  //       Paths (e.g. `/foo/bar`), query strings, ports, userinfo, and fragments are not supported and will fail to parse.
                },
              },
            ]);
          });
        },
      },
    ]);
  });
}

// Singleton Parser Instance
const parserInstance = new YetiCstParser();
const BaseYetiVisitor = parserInstance.getBaseCstVisitorConstructor();

// -----------------
// 4. AST Builder (Visitor)
// -----------------
class YetiAstVisitor extends BaseYetiVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  parsedFile(ctx: any): Namespace[] {
    return ctx.parsedNamespace?.map((node: CstNode) => this.visit(node)) || [];
  }

  parsedNamespace(ctx: any): Namespace {
    return {
      name: ctx.Identifier[0].image,
      entities:
        ctx.parsedEntity?.map((node: CstNode) => this.visit(node)) || [],
      enums: ctx.parsedEnum?.map((node: CstNode) => this.visit(node)) || [],
    };
  }

  parsedEntity(ctx: any): Entity {
    return {
      name: ctx.Identifier[0].image,
      fields: ctx.parsedField?.map((node: CstNode) => this.visit(node)) || [],
    };
  }

  parsedEnum(ctx: any): Enum {
    return {
      name: ctx.Identifier[0].image,
      values: ctx.Identifier.slice(1).map((t: IToken) => t.image),
    };
  }

  parsedField(ctx: any): Field {
    const attributes =
      ctx.parsedAttribute?.map((node: CstNode) => this.visit(node)) || [];

    const ATTRIBUTE_PRIORITIES = new Map([
      ["pk", 1],
      ["unique", 2],
      ["default", 3],
      ["fk", 4],
    ]);

    attributes.sort((a: Attribute, b: Attribute) => {
      const priorityA = ATTRIBUTE_PRIORITIES.get(a.name) ?? 999;
      const priorityB = ATTRIBUTE_PRIORITIES.get(b.name) ?? 999;
      return priorityA - priorityB;
    });

    return {
      name: ctx.Identifier[0].image,
      type: ctx.Identifier[1].image,
      attributes,
    };
  }

  parsedAttribute(ctx: any): Attribute {
    const name = ctx.Identifier[0].image;
    const params =
      ctx.parsedParam?.map((node: CstNode) => this.visit(node)) || [];
    return { name, params };
  }

  parsedParam(ctx: any): string {
    if (ctx.StringLiteral) return ctx.StringLiteral[0].image.slice(1, -1);
    if (ctx.True) return "true";
    if (ctx.False) return "false";

    // Check for explicit Entity reference (> Entity.Field)
    if (ctx.GreaterThan) {
      return `> ${ctx.Identifier[0].image}.${ctx.Identifier[1].image}`;
    }

    // Check for identifier-based patterns.
    // In this rule, Identifier tokens are accumulated in ctx.Identifier in order of appearance.
    // For the simple identifier case we use the first one (index 0); additional identifiers
    // are used in more complex patterns handled below (for example, URLs or qualified names).

    if (ctx.Identifier) {
      let result = ctx.Identifier[0].image;

      // Function call: ident(params...)
      if (ctx.LParen) {
        const innerParams =
          ctx.parsedParam?.map((node: CstNode) => this.visit(node)) || [];
        return `${result}(${innerParams.join(", ")})`;
      }

      // URL: protocol://domain.tld
      if (ctx.Colon && ctx.Slash) {
        result += "://";
        if (ctx.Identifier[1]) result += ctx.Identifier[1].image; // domain
        if (ctx.Dot && ctx.Identifier[2]) {
          result += "." + ctx.Identifier[2].image; // tld
        }
        return result;
      }

      return result;
    }

    return "";
  }
}

// -----------------
// 5. Public API (Backward Compatibility)
// -----------------
export class YetiParser {
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  public parse(): Namespace[] {
    const lexResult = YetiLexer.tokenize(this.input);

    if (lexResult.errors.length > 0) {
      throw new Error(`Lexing errors: ${lexResult.errors[0].message}`);
    }

    parserInstance.input = lexResult.tokens;
    const cst = parserInstance.parsedFile();

    if (parserInstance.errors.length > 0) {
      throw new Error(`Parsing errors: ${parserInstance.errors[0].message}`);
    }

    const visitor = new YetiAstVisitor();
    return visitor.visit(cst);
  }
}
