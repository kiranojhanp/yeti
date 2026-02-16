import * as vscode from "vscode";
import { YetiLexer, parserInstance, IToken } from "@yeti/parse";

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

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "yeti" },
      new YetiCompletionItemProvider()
    )
  );
}

class YetiCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const text = document.getText();
    const offset = document.offsetAt(position);
    const textBefore = text.substring(0, offset);

    // 1. Tokenize text up to cursor
    const lexingResult = YetiLexer.tokenize(textBefore);

    // 2. Handle partial tokens
    // If the text doesn't end with whitespace, we are likely completing the last token.
    // We should remove it from the context passed to the parser, so the parser
    // tells us what is expected *at that position*.
    const endsWithWhitespace = /\s$/.test(textBefore);
    let tokenVector = lexingResult.tokens;

    if (!endsWithWhitespace && tokenVector.length > 0) {
      tokenVector = tokenVector.slice(0, -1);
    }

    // 3. Ask Chevrotain for suggestions
    const suggestions = parserInstance.computeContentAssist(
      "parsedFile",
      tokenVector
    );

    // 4. Convert suggestions to VS Code CompletionItems
    const completionItems: vscode.CompletionItem[] = [];

    suggestions.forEach((suggestion: any) => {
      const tokenName = suggestion.nextTokenType.name;

      // If the parser expects an Identifier, we can provide more specific suggestions
      // based on context.
      if (tokenName === "Identifier") {
        // Check if we are inside an attribute (preceded by '@')
        // We look at the last token in our vector.
        const lastToken =
          tokenVector.length > 0 ? tokenVector[tokenVector.length - 1] : null;

        if (lastToken && lastToken.tokenType.name === "At") {
          // Attribute suggestions
          ["pk", "unique", "default", "fk"].forEach((attr) => {
            completionItems.push(
              new vscode.CompletionItem(
                attr,
                vscode.CompletionItemKind.Property
              )
            );
          });
        } else {
          // Standard Types suggestions
          ["String", "Int", "Boolean", "Float", "DateTime", "ID"].forEach(
            (type) => {
              completionItems.push(
                new vscode.CompletionItem(type, vscode.CompletionItemKind.Class)
              );
            }
          );
          // Also suggest "Identifier" generic just in case
          completionItems.push(
            new vscode.CompletionItem(
              "Identifier",
              vscode.CompletionItemKind.Variable
            )
          );
        }
      } else {
        // Map Token Type to a friendly label
        const label = this.getLabelForToken(tokenName);
        if (label) {
          const item = new vscode.CompletionItem(
            label,
            this.getKindForToken(tokenName)
          );
          completionItems.push(item);
        }
      }
    });

    return completionItems;
  }

  private getLabelForToken(tokenName: string): string | null {
    switch (tokenName) {
      case "NamespaceKeyword":
        return "namespace";
      case "EntityKeyword":
        return "entity";
      case "EnumKeyword":
        return "enum";
      case "True":
        return "true";
      case "False":
        return "false";
      // Add other keywords as needed
      case "Identifier":
        return "Identifier"; // Placeholder, maybe redundant if we don't have symbols
      case "StringLiteral":
        return "''";
      case "At":
        return "@";
      default:
        // For simple tokens or symbols, we might not want to autocomplete them always,
        // or we return the token pattern if it's constant string.
        if (tokenName.endsWith("Keyword")) {
          return tokenName.replace("Keyword", "").toLowerCase();
        }
        return null;
    }
  }

  private getKindForToken(tokenName: string): vscode.CompletionItemKind {
    switch (tokenName) {
      case "NamespaceKeyword":
      case "EntityKeyword":
      case "EnumKeyword":
        return vscode.CompletionItemKind.Keyword;
      case "True":
      case "False":
        return vscode.CompletionItemKind.Constant;
      case "At":
        return vscode.CompletionItemKind.Keyword;
      case "Identifier":
        return vscode.CompletionItemKind.Variable;
      default:
        return vscode.CompletionItemKind.Text;
    }
  }
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
