import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { createHash } from "crypto";
import { FileLoader } from "../file-loader";

describe("FileLoader", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "migration-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("stores full path in file property", () => {
    writeFileSync(
      join(tempDir, "001-init.sql"),
      "CREATE TABLE users (id INT);"
    );

    const migrations = FileLoader.loadMigrations(tempDir);

    expect(migrations[0].file).toBe(join(tempDir, "001-init.sql"));
  });

  it("produces correct content and hash", () => {
    const sqlContent = "CREATE TABLE users (id INT);";
    writeFileSync(join(tempDir, "001-init.sql"), sqlContent);

    const migrations = FileLoader.loadMigrations(tempDir);
    const expectedHash = createHash("sha256")
      .update(Buffer.from(sqlContent))
      .digest("hex");

    expect(migrations[0].content).toBe(sqlContent);
    expect(migrations[0].hash).toBe(expectedHash);
  });

  it("sorts files by numeric ID", () => {
    writeFileSync(join(tempDir, "003-third.sql"), "SELECT 3;");
    writeFileSync(join(tempDir, "001-first.sql"), "SELECT 1;");
    writeFileSync(join(tempDir, "002-second.sql"), "SELECT 2;");

    const migrations = FileLoader.loadMigrations(tempDir);

    expect(migrations.map((m) => m.id)).toEqual([1, 2, 3]);
    expect(migrations.map((m) => m.name)).toEqual([
      "001-first",
      "002-second",
      "003-third",
    ]);
  });

  it("only includes .sql and .js files", () => {
    writeFileSync(join(tempDir, "001-init.sql"), "SELECT 1;");
    writeFileSync(join(tempDir, "002-seed.js"), "module.exports = {};");
    writeFileSync(join(tempDir, "003-readme.md"), "# Notes");
    writeFileSync(join(tempDir, "not-a-migration.sql"), "SELECT 1;");
    writeFileSync(join(tempDir, "004-data.txt"), "data");

    const migrations = FileLoader.loadMigrations(tempDir);

    expect(migrations).toHaveLength(2);
    expect(migrations.map((m) => m.id)).toEqual([1, 2]);
  });
});
