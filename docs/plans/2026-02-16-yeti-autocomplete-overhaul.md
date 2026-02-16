# Yeti Autocomplete Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul `YetiCompletionItemProvider` to provide context-aware suggestions, snippets for attributes, and intelligent value completion.

**Architecture:**
We will replace the naive single-token check with a robust context analysis using the token stream. We'll introduce a `SymbolScanner` for quick entity/enum discovery and a `ContextAnalyzer` to determine the exact syntactic scope (Namespace, Entity, Field, Attribute, etc.). Suggestions will be enriched with VS Code Snippets.

**Tech Stack:** TypeScript, VS Code Extension API, Chevrotain (Lexer/Parser)

---

### Task 1: Fix Existing Test Failures

**Files:**

- Modify: `packages/parse/src/__tests__/fields.test.ts`
- Modify: `packages/parse/src/parse.ts`

**Step 1: Analyze Failure**
The test `empty field name throws` expects `parser.parse()` to throw, but it doesn't. This is likely because the parser recovers from errors instead of throwing, or `CONSUME` doesn't throw in the way the test expects when inside a `MANY` loop or similar structure. We need to ensure `parser.parse()` returns errors or throws if configured. Currently `parser.parse()` catches errors and returns them in the `errors` array.

**Step 2: Update Test Expectation**
The `YetiParser.parse()` method (wrapper) catches exceptions and returns an object `{ ast, errors }`. The test expects it to _throw_ a JS error. We should update the test to assert that `errors` array is not empty, which is the correct behavior for a parser that supports error recovery.

**Step 3: Modify `packages/parse/src/__tests__/fields.test.ts`**
Change `expect(() => parser.parse()).toThrow()` to:

```typescript
const result = parser.parse();
expect(result.errors.length).toBeGreaterThan(0);
```

**Step 4: Verify**
Run `npm test` in `packages/parse`.

---

### Task 2: Implement Context Analyzer & Symbol Scanner

**Files:**

- Create: `packages/vscode-plugin/src/autocomplete/context.ts`
- Create: `packages/vscode-plugin/src/autocomplete/symbols.ts`
- Modify: `packages/vscode-plugin/src/extension.ts`

**Step 1: Create `context.ts`**
Implement `determineContext(tokens: IToken[], offset: number): ContextType`.

- **Logic:** Iterate backwards from the cursor token.
- **States:** `TopLevel`, `Namespace`, `Entity`, `Enum`, `Field`, `Attribute`, `AttributeParam`.
- **Heuristic:**
  - If last relevant token is `:`, check predecessor.
  - If `namespace X :`, we are in Namespace.
  - If `entity X :`, we are in Entity.
  - If `enum X :`, we are in Enum.
  - If inside `entity`, and we see `field: type`, we are looking for attributes (`@`).
  - If inside `@attr(`, we are in AttributeParam.

**Step 2: Create `symbols.ts`**
Move and enhance `extractSymbols` from `extension.ts` to this file.

- **Enhancement:** Return a `Scope` object that allows querying "What entities exist?", "What fields does Entity X have?".
- Use a lightweight regex pass if the CST is broken, OR rely on the best-effort CST traverse.

**Step 3: Integrate into `extension.ts`**
Import these utilities.

---

### Task 3: Implement Attribute Snippets & Value Suggestions

**Files:**

- Modify: `packages/vscode-plugin/src/extension.ts`

**Step 1: Attribute Snippets**
In `provideCompletionItems`:

- Detect `Context.Field` or `Context.Entity` (depending on where attributes are valid).
- Return `CompletionItem` with `kind = Snippet`.
- **Snippets:**
  - `@default`: `@default(${1:value})`
  - `@fk`: `@fk(> ${1:Entity}.${2:field})`
  - `@pk`, `@unique`: Simple text.

**Step 2: Value Suggestions**
In `provideCompletionItems`:

- Detect `Context.AttributeParam`.
- Check active attribute name (e.g., scan back to `@name`).
- If `@default`:
  - Suggest `now()`, `null`.
  - If field type is `boolean`, suggest `true`, `false`.
- If `@fk`:
  - If cursor is at start of param: suggest `> Entity`.
  - If cursor is after `> Entity.`: suggest fields of that entity.

---

### Task 4: Enhance Top-Level & Keyword Suggestions

**Files:**

- Modify: `packages/vscode-plugin/src/extension.ts`

**Step 1: Top Level**

- If `Context.TopLevel`: Suggest `namespace`.

**Step 2: Namespace Level**

- If `Context.Namespace`: Suggest `entity`, `enum`.

**Step 3: Field Type**

- If `Context.FieldDefinition` (after `name:`):
  - Suggest built-in types (`string`, `integer`, etc.).
  - Suggest defined Enum names (from `SymbolScanner`).

---

### Task 5: Verify & Refine

**Files:**

- Test: Manual verification via mock tests in `extension.ts` or new unit tests if possible.

**Step 1: Add Unit Tests for `ContextAnalyzer`**
Create `packages/vscode-plugin/src/test/context.test.ts` (if test setup allows) or add logic tests in `packages/parse` if generic enough.

**Step 2: Manual Check**
Since we can't easily run VS Code UI tests here, we will rely on unit testing the _logic_ (Context Analyzer) heavily.
