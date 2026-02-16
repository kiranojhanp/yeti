import { describe, it, expect } from "vitest";
import { YetiLexer, parserInstance } from "../index";

describe("Autocomplete", () => {
  it("should suggest 'namespace' at the beginning of the file", () => {
    const input = " ";
    const lexResult = YetiLexer.tokenize(input);
    const suggestions = parserInstance.computeContentAssist(
      "parsedFile",
      lexResult.tokens
    );

    // We expect suggestions to contain the NamespaceKeyword token type
    const suggestedKeywords = suggestions.map((s) => s.nextTokenType.name);
    expect(suggestedKeywords).toContain("NamespaceKeyword");
  });

  it("should suggest 'entity' or 'enum' inside a namespace", () => {
    const input = "namespace MySpace: ";
    const lexResult = YetiLexer.tokenize(input);
    const suggestions = parserInstance.computeContentAssist(
      "parsedFile",
      lexResult.tokens
    );

    const suggestedKeywords = suggestions.map((s) => s.nextTokenType.name);
    expect(suggestedKeywords).toContain("EntityKeyword");
    expect(suggestedKeywords).toContain("EnumKeyword");
  });

  it("should suggest field types inside an entity", () => {
    const input = "namespace MySpace: entity User: id: ";
    const lexResult = YetiLexer.tokenize(input);
    const suggestions = parserInstance.computeContentAssist(
      "parsedFile",
      lexResult.tokens
    );

    const suggestedKeywords = suggestions.map((s) => s.nextTokenType.name);
    // It should suggest Identifier (which covers types)
    expect(suggestedKeywords).toContain("Identifier");
  });

  it("should suggest attributes after a field type", () => {
    const input = "namespace MySpace: entity User: id: String ";
    const lexResult = YetiLexer.tokenize(input);
    const suggestions = parserInstance.computeContentAssist(
      "parsedFile",
      lexResult.tokens
    );

    // It should suggest At (@) for attributes, or another field (Identifier)
    const suggestedKeywords = suggestions.map((s) => s.nextTokenType.name);
    expect(suggestedKeywords).toContain("At");
    expect(suggestedKeywords).toContain("Identifier");
  });
});
