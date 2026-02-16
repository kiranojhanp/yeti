import * as vscode from "vscode";
import { YetiLexer, parserInstance, IToken, CstNode } from "@yeti/parse";

const legend = new vscode.SemanticTokensLegend(
  ["keyword", "type", "variable", "property", "enumMember", "string", "number"], // token types
  ["declaration", "readonly"] // token modifiers
);

interface SymbolTable {
  entities: string[];
  enums: string[];
  enumValues: Map<string, string[]>;
  entityFields: Map<string, Map<string, string>>; // Entity -> Field -> Type
}

function extractSymbols(tokenVector: IToken[]): SymbolTable {
  const symbols: SymbolTable = {
    entities: [],
    enums: [],
    enumValues: new Map(),
    entityFields: new Map(),
  };

  // Reset parser state
  parserInstance.input = tokenVector;

  try {
    // Parse the file. Even if it throws/errors, we might get a partial CST or we catch it.
    const cst = parserInstance.parsedFile();

    if (cst) {
      traverseCst(cst, symbols);
    }
  } catch (e) {
    // Ignore parsing errors for symbol extraction, just do our best
    console.error("Symbol extraction error", e);
  }

  return symbols;
}

function traverseCst(node: CstNode, symbols: SymbolTable) {
  if (node.name === "parsedEntity") {
    const entityNameToken = node.children.Identifier?.[0] as IToken;
    if (entityNameToken) {
      const entityName = entityNameToken.image;
      symbols.entities.push(entityName);

      const fieldMap = new Map<string, string>();
      if (node.children.parsedField) {
        (node.children.parsedField as CstNode[]).forEach((fieldNode) => {
          const fieldName = (fieldNode.children.Identifier?.[0] as IToken)
            ?.image;
          const fieldType = (fieldNode.children.Identifier?.[1] as IToken)
            ?.image;
          if (fieldName && fieldType) {
            fieldMap.set(fieldName, fieldType);
          }
        });
      }
      symbols.entityFields.set(entityName, fieldMap);
    }
  } else if (node.name === "parsedEnum") {
    const enumNameToken = node.children.Identifier?.[0] as IToken;
    if (enumNameToken) {
      const enumName = enumNameToken.image;
      symbols.enums.push(enumName);

      const values: string[] = [];
      if (node.children.Identifier && node.children.Identifier.length > 1) {
        // Skip first (name)
        values.push(
          ...node.children.Identifier.slice(1).map((t: any) => t.image)
        );
      }
      symbols.enumValues.set(enumName, values);
    }
  }

  // Recurse
  if (node.children) {
    for (const key in node.children) {
      (node.children[key] as CstNode[]).forEach((child) => {
        if (child.name) traverseCst(child, symbols);
      });
    }
  }
}

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
      new YetiCompletionItemProvider(),
      ".",
      ":",
      "@",
      "(",
      ">" // Trigger characters
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
    const text = document.getText();
    const lexingResult = YetiLexer.tokenize(text);

    // Simple semantic highlighting based on tokens
    const builder = new vscode.SemanticTokensBuilder(legend);

    lexingResult.tokens.forEach((token) => {
      const type = this.getTokenType(token);
      if (type) {
        builder.push(
          new vscode.Range(
            new vscode.Position(token.startLine! - 1, token.startColumn! - 1),
            new vscode.Position(
              token.startLine! - 1,
              token.startColumn! - 1 + token.image.length
            )
          ),
          type
        );
      }
    });

    return builder.build();
  }

  private getTokenType(token: IToken): string | undefined {
    if (
      token.tokenType.name === "EntityKeyword" ||
      token.tokenType.name === "NamespaceKeyword" ||
      token.tokenType.name === "EnumKeyword"
    ) {
      return "keyword";
    }
    if (token.tokenType.name === "Identifier") {
      // Naive heuristic: if previous token was 'entity' -> declaration
      return "variable";
    }
    if (token.tokenType.name === "StringLiteral") {
      return "string";
    }
    return undefined;
  }
}

class YetiCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const text = document.getText();
    const lexResult = YetiLexer.tokenize(text);

    // 1. Extract Symbols from full text (for cross-references)
    const symbols = extractSymbols(lexResult.tokens);

    // 2. Compute Content Assist at cursor
    const offset = document.offsetAt(position);
    const textUpToCursor = text.substring(0, offset);
    const cursorLexResult = YetiLexer.tokenize(textUpToCursor);

    let tokensForAssist = cursorLexResult.tokens;
    if (tokensForAssist.length > 0) {
      const lastToken = tokensForAssist[tokensForAssist.length - 1];
      // If we are currently typing an identifier (or keyword that looks like one), pop it
      // so we get suggestions for what should be at this position.
      // VS Code handles the filtering.
      if (
        lastToken.tokenType.name === "Identifier" ||
        lastToken.tokenType.name === "EntityKeyword" || // e.g. typing "ent"
        lastToken.tokenType.name === "EnumKeyword" ||
        lastToken.tokenType.name === "NamespaceKeyword"
      ) {
        tokensForAssist = tokensForAssist.slice(0, -1);
      }
    }

    try {
      const suggestions = parserInstance.computeContentAssist(
        "parsedFile",
        tokensForAssist
      );

      const items: vscode.CompletionItem[] = [];

      suggestions.forEach((suggestion) => {
        const lastToken =
          tokensForAssist.length > 0
            ? tokensForAssist[tokensForAssist.length - 1]
            : null;

        if (suggestion.nextTokenType.name === "Identifier") {
          // Determine context from rule stack
          const ruleStack = suggestion.ruleStack;

          // Context: Defining a Field Type?
          // parsedField -> Identifier Colon Identifier(Type)
          const isFieldType =
            ruleStack.includes("parsedField") &&
            lastToken?.tokenType.name === "Colon";

          if (isFieldType) {
            // Standard Types
            ["String", "Int", "Boolean", "Date", "Float", "ID"].forEach((t) => {
              items.push(
                new vscode.CompletionItem(t, vscode.CompletionItemKind.Class)
              );
            });
            // Entities
            symbols.entities.forEach((e) => {
              items.push(
                new vscode.CompletionItem(e, vscode.CompletionItemKind.Struct)
              );
            });
            // Enums
            symbols.enums.forEach((e) => {
              items.push(
                new vscode.CompletionItem(e, vscode.CompletionItemKind.Enum)
              );
            });
          }
          // Context: Inside an Attribute Param?
          // parsedParam -> ... > Entity.Field
          else if (ruleStack.includes("parsedParam")) {
            // Check if we are typing after a Dot
            if (lastToken?.tokenType.name === "Dot") {
              // Likely > Entity.Field or Enum.Value
              // Check the token before Dot
              const prevToken =
                tokensForAssist.length > 1
                  ? tokensForAssist[tokensForAssist.length - 2]
                  : null;

              if (prevToken && prevToken.tokenType.name === "Identifier") {
                const name = prevToken.image;

                // If it's an Entity, suggest fields
                if (symbols.entityFields.has(name)) {
                  // ... (existing logic) ...
                  const fields = symbols.entityFields.get(name);
                  if (fields) {
                    fields.forEach((type, field) => {
                      const item = new vscode.CompletionItem(
                        field,
                        vscode.CompletionItemKind.Field
                      );
                      item.detail = type;
                      items.push(item);
                    });
                  }
                }
                // If it's an Enum, suggest values
                if (symbols.enumValues.has(name)) {
                  // ... (existing logic) ...
                  const values = symbols.enumValues.get(name);
                  if (values) {
                    values.forEach((val) => {
                      items.push(
                        new vscode.CompletionItem(
                          val,
                          vscode.CompletionItemKind.EnumMember
                        )
                      );
                    });
                  }
                }
              }
            }
            // Check if we are typing after GreaterThan (Entity ref)
            else if (lastToken?.tokenType.name === "GreaterThan") {
              symbols.entities.forEach((e) => {
                items.push(
                  new vscode.CompletionItem(e, vscode.CompletionItemKind.Struct)
                );
              });
            }
          }
        } else if (suggestion.nextTokenType.name === "At") {
          // Suggest Attributes
          ["pk", "unique", "default", "fk"].forEach((attr) => {
            const item = new vscode.CompletionItem(
              "@" + attr,
              vscode.CompletionItemKind.Property
            );
            item.insertText = "@" + attr;
            items.push(item);
          });
        }
        // ... keywords ...
        else if (suggestion.nextTokenType.name === "NamespaceKeyword") {
          items.push(
            new vscode.CompletionItem(
              "namespace",
              vscode.CompletionItemKind.Keyword
            )
          );
        } else if (suggestion.nextTokenType.name === "EntityKeyword") {
          items.push(
            new vscode.CompletionItem(
              "entity",
              vscode.CompletionItemKind.Keyword
            )
          );
        } else if (suggestion.nextTokenType.name === "EnumKeyword") {
          items.push(
            new vscode.CompletionItem("enum", vscode.CompletionItemKind.Keyword)
          );
        }

        // Handle At special case (if next expected is Identifier but we just typed At)
        // Wait, if we popped Identifier, this logic might need adjustment.
        // If we typed '@', lastToken is At. tokensForAssist has At.
        // suggestion says Identifier (attribute name).
        // So this block handles:
        if (
          suggestion.nextTokenType.name === "Identifier" &&
          lastToken?.tokenType.name === "At"
        ) {
          ["pk", "unique", "default", "fk"].forEach((attr) => {
            items.push(
              new vscode.CompletionItem(
                attr,
                vscode.CompletionItemKind.Property
              )
            );
          });
        }
      });

      return items;
    } catch (e) {
      console.error("Autocomplete error", e);
      return [];
    }
  }
}
