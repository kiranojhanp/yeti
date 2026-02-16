import * as vscode from "vscode";
import { YetiLexer, allTokens, IToken } from "@yeti/parse";

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

const legend = (function () {
  const tokenTypesLegend = [
    "comment",
    "string",
    "keyword",
    "number",
    "regexp",
    "operator",
    "namespace",
    "type",
    "struct",
    "class",
    "interface",
    "enum",
    "typeParameter",
    "function",
    "member",
    "macro",
    "variable",
    "parameter",
    "property",
    "label",
  ];
  tokenTypesLegend.forEach((tokenType, index) =>
    tokenTypes.set(tokenType, index)
  );

  const tokenModifiersLegend = [
    "declaration",
    "documentation",
    "readonly",
    "static",
    "abstract",
    "deprecated",
    "modification",
    "async",
  ];
  tokenModifiersLegend.forEach((tokenModifier, index) =>
    tokenModifiers.set(tokenModifier, index)
  );

  return new vscode.SemanticTokensLegend(
    tokenTypesLegend,
    tokenModifiersLegend
  );
})();

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      { language: "yeti" },
      new DocumentSemanticTokensProvider(),
      legend
    )
  );
}

class DocumentSemanticTokensProvider
  implements vscode.DocumentSemanticTokensProvider
{
  async provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.SemanticTokens> {
    const documentTokens = this._tokenize(document.getText());
    const builder = new vscode.SemanticTokensBuilder();

    documentTokens.forEach((token) => {
      const type = this._getTokenType(token);
      if (type) {
        builder.push(
          token.startLine! - 1,
          token.startColumn! - 1,
          token.endColumn! - token.startColumn! + 1,
          this._encodeTokenType(type),
          this._encodeTokenModifiers(token)
        );
      }
    });

    return builder.build();
  }

  private _tokenize(text: string): IToken[] {
    const lexingResult = YetiLexer.tokenize(text);
    if (lexingResult.errors.length > 0) {
      console.error("Lexing errors:", lexingResult.errors);
      // We can return partial results or just the valid tokens
    }
    return lexingResult.tokens;
  }

  private _getTokenType(token: IToken): string | undefined {
    // Map Chevrotain token names to VS Code semantic token types
    switch (token.tokenType.name) {
      case "NamespaceKeyword":
      case "EntityKeyword":
      case "EnumKeyword":
      case "True":
      case "False":
        return "keyword";
      case "Identifier":
        // Context-aware mapping would be better here (Parser-based),
        // but for now, we can use simple heuristics or just 'variable'/'type'
        // Ideally, we'd use the Parser to build an AST and traverse it to know
        // if an identifier is a class name, a property, etc.
        // For a pure Lexer-based approach, it's limited.
        // However, since we have the parser in @yeti/parse, let's stick to Lexer for speed first
        // and see if we can infer from context (previous token).
        // But Chevrotain Tokens don't have "previous" links easily accessible in this loop unless we track index.

        // Heuristic: Capitalized is likely a Type/Class/Enum
        if (/^[A-Z]/.test(token.image)) {
          return "class";
        }
        return "property";
      case "StringLiteral":
        return "string";
      case "Comment":
        return "comment";
      case "At":
        return "macro"; // Decorator
      default:
        return undefined;
    }
  }

  private _encodeTokenType(tokenType: string): number {
    if (tokenTypes.has(tokenType)) {
      return tokenTypes.get(tokenType)!;
    }
    return 0;
  }

  private _encodeTokenModifiers(token: IToken): number {
    return 0;
  }
}
