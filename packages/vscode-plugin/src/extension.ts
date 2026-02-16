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
  definitions: Map<string, vscode.Location>; // Name -> Location
}

function extractSymbols(tokenVector: IToken[], uri: vscode.Uri): SymbolTable {
  const symbols: SymbolTable = {
    entities: [],
    enums: [],
    enumValues: new Map(),
    entityFields: new Map(),
    definitions: new Map(),
  };

  // Reset parser state
  parserInstance.input = tokenVector;

  try {
    const cst = parserInstance.parsedFile();

    if (cst) {
      traverseCst(cst, symbols, uri);
    }
  } catch (e) {
    console.error("Symbol extraction error", e);
  }

  return symbols;
}

function traverseCst(node: CstNode, symbols: SymbolTable, uri: vscode.Uri) {
  if (node.name === "parsedEntity") {
    const entityNameToken = node.children.Identifier?.[0] as IToken;
    if (entityNameToken) {
      const entityName = entityNameToken.image;
      symbols.entities.push(entityName);
      symbols.definitions.set(
        entityName,
        new vscode.Location(
          uri,
          new vscode.Range(
            entityNameToken.startLine! - 1,
            entityNameToken.startColumn! - 1,
            entityNameToken.endLine! - 1,
            entityNameToken.endColumn!
          )
        )
      );

      const fieldMap = new Map<string, string>();
      if (node.children.parsedField) {
        (node.children.parsedField as CstNode[]).forEach((fieldNode) => {
          const fieldNameToken = fieldNode.children.Identifier?.[0] as IToken;
          const fieldType = (fieldNode.children.Identifier?.[1] as IToken)
            ?.image;
          if (fieldNameToken && fieldType) {
            const fieldName = fieldNameToken.image;
            fieldMap.set(fieldName, fieldType);
            symbols.definitions.set(
              `${entityName}.${fieldName}`,
              new vscode.Location(
                uri,
                new vscode.Range(
                  fieldNameToken.startLine! - 1,
                  fieldNameToken.startColumn! - 1,
                  fieldNameToken.endLine! - 1,
                  fieldNameToken.endColumn!
                )
              )
            );
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
      symbols.definitions.set(
        enumName,
        new vscode.Location(
          uri,
          new vscode.Range(
            enumNameToken.startLine! - 1,
            enumNameToken.startColumn! - 1,
            enumNameToken.endLine! - 1,
            enumNameToken.endColumn!
          )
        )
      );

      const values: string[] = [];
      if (node.children.Identifier && node.children.Identifier.length > 1) {
        // Skip first (name)
        const valueTokens = node.children.Identifier.slice(1) as IToken[];
        valueTokens.forEach((t) => {
          values.push(t.image);
          symbols.definitions.set(
            `${enumName}.${t.image}`,
            new vscode.Location(
              uri,
              new vscode.Range(
                t.startLine! - 1,
                t.startColumn! - 1,
                t.endLine! - 1,
                t.endColumn!
              )
            )
          );
        });
      }
      symbols.enumValues.set(enumName, values);
    }
  }

  // Recurse
  if (node.children) {
    for (const key in node.children) {
      (node.children[key] as CstNode[]).forEach((child) => {
        if (child.name) traverseCst(child, symbols, uri);
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

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "yeti" },
      new YetiHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { language: "yeti" },
      new YetiDefinitionProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerRenameProvider(
      { language: "yeti" },
      new YetiRenameProvider()
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
    const symbols = extractSymbols(lexResult.tokens, document.uri);

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

class YetiHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return undefined;

    const word = document.getText(range);
    const text = document.getText();
    const lexResult = YetiLexer.tokenize(text);
    const symbols = extractSymbols(lexResult.tokens, document.uri);

    // Check if it's an Entity
    if (symbols.entities.includes(word)) {
      return new vscode.Hover(`**Entity** \`${word}\``);
    }
    // Check if it's an Enum
    if (symbols.enums.includes(word)) {
      return new vscode.Hover(`**Enum** \`${word}\``);
    }
    // Check if it's a Field (naive check: search in all entities)
    for (const [entity, fields] of symbols.entityFields) {
      if (fields.has(word)) {
        const type = fields.get(word);
        return new vscode.Hover(
          `**Field** \`${word}\`\n\nType: \`${type}\`\n\nEntity: \`${entity}\``
        );
      }
    }
    // Check if it's an Enum Value
    for (const [enumName, values] of symbols.enumValues) {
      if (values.includes(word)) {
        return new vscode.Hover(
          `**Enum Value** \`${word}\`\n\nEnum: \`${enumName}\``
        );
      }
    }

    return undefined;
  }
}

class YetiDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return undefined;

    const word = document.getText(range);
    const text = document.getText();
    const lexResult = YetiLexer.tokenize(text);
    const symbols = extractSymbols(lexResult.tokens, document.uri);

    // If it's a known symbol definition, return it
    if (symbols.definitions.has(word)) {
      // If we are hovering over the definition itself, returning it is fine.
      // But if we are referencing it, we need to find the definition.
      // Currently extractSymbols only stores the definition location by name.
      // It doesn't tell us if the *current position* is a reference or definition.
      // However, "Go to Definition" usually works by looking up the symbol name in the index.
      return symbols.definitions.get(word);
    }

    // Handle "Entity.Field" or "Enum.Value" cases (e.g. in params)
    // Naive approach: check if word is a field name in any entity
    // Better approach: look at context. But for now, simple lookup.
    // Note: If multiple entities have same field name, this is ambiguous.
    // For now, we return the first one found or list all? DefinitionProvider can return array.

    const locations: vscode.Location[] = [];

    // Check for "Entity.Field" pattern if word is part of it?
    // VSCode gives us the word at position.
    // If we want to support "Entity.Field", we might need to look at surrounding text.

    // Let's just return definitions for matching fields/values
    for (const [name, loc] of symbols.definitions) {
      if (name.endsWith(`.${word}`)) {
        locations.push(loc);
      }
    }

    if (locations.length > 0) return locations;

    return undefined;
  }
}

class YetiRenameProvider implements vscode.RenameProvider {
  provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.WorkspaceEdit> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return undefined;

    const word = document.getText(range);
    const text = document.getText();
    const lexResult = YetiLexer.tokenize(text);

    // We need to find ALL occurrences of this token.
    // Using the lexer is safer than regex.

    const edit = new vscode.WorkspaceEdit();

    lexResult.tokens.forEach((t) => {
      if (t.image === word && t.tokenType.name === "Identifier") {
        // We should refine this to only rename valid symbols (e.g. not keywords that happen to look like identifiers, though our lexer handles that).
        // Also scope: If we rename a Field, we should only rename fields of that Entity?
        // Without full semantic analysis (resolving references), global rename is risky.
        // But for a "basic" implementation, renaming all occurrences of the identifier is a starting point.
        // However, let's be slightly smarter:
        // If we are renaming an Entity, we rename:
        // 1. The definition
        // 2. Usages as types
        // 3. Usages in > Entity.Field

        // This requires knowing if 'word' is an Entity, Field, etc.
        // extractSymbols gives us that info.

        edit.replace(
          document.uri,
          new vscode.Range(
            t.startLine! - 1,
            t.startColumn! - 1,
            t.endLine! - 1,
            t.endColumn!
          ),
          newName
        );
      }
    });

    return edit;
  }
}
