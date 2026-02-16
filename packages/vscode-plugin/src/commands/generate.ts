import * as vscode from "vscode";
import { YetiParser } from "@yeti/parse";
import { PostgresGenerator } from "@yeti/pg-generator";

export async function generateSql() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const text = editor.document.getText();
  const parser = new YetiParser(text);
  const result = parser.parse();

  if (result.errors.length > 0) {
    const errorMessages = result.errors.map((e) => e.message).join("\n");
    vscode.window.showErrorMessage(`Parse errors:\n${errorMessages}`);
    return;
  }

  try {
    const generator = new PostgresGenerator();
    // Verify that result.ast is what generateSQL expects.
    // YetiParser.parse returns { ast: Namespace[], ... }
    // PostgresGenerator.generateSQL expects Namespace[] (from BaseSQLGenerator)
    const sql = generator.generateSQL(result.ast);

    const doc = await vscode.workspace.openTextDocument({
      content: sql,
      language: "sql",
    });
    await vscode.window.showTextDocument(doc);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Generation failed: ${error.message}`);
  }
}
