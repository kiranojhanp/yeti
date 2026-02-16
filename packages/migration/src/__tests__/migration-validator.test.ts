import { describe, it, expect } from "vitest";
import { MigrationValidator } from "../migration-validator";
import type { Migration } from "../types";

function makeMigration(id: number, hash = `hash-${id}`): Migration {
  return {
    id,
    name: `migration-${id}`,
    content: `SELECT ${id};`,
    hash,
    file: `/migrations/${id}-migration.sql`,
  };
}

describe("MigrationValidator", () => {
  describe("validateAppliedContiguous", () => {
    it("passes for contiguous applied migrations", () => {
      const files = [makeMigration(1), makeMigration(2), makeMigration(3)];
      const applied = [makeMigration(1), makeMigration(2)];

      expect(() => MigrationValidator.validate(files, applied)).not.toThrow();
    });

    it("throws for gap in applied migrations", () => {
      const files = [makeMigration(1), makeMigration(2), makeMigration(3)];
      const applied = [makeMigration(1), makeMigration(3)];

      expect(() => MigrationValidator.validate(files, applied)).toThrow(
        "Applied migrations are not contiguous: expected id 2, found 3"
      );
    });

    it("passes for empty applied migrations", () => {
      const files = [makeMigration(1), makeMigration(2)];
      const applied: Migration[] = [];

      expect(() => MigrationValidator.validate(files, applied)).not.toThrow();
    });
  });

  describe("validateSequence", () => {
    it("passes for sequential file IDs", () => {
      const files = [makeMigration(1), makeMigration(2), makeMigration(3)];
      const applied: Migration[] = [];

      expect(() => MigrationValidator.validate(files, applied)).not.toThrow();
    });

    it("throws for gap in file sequence", () => {
      const files = [makeMigration(1), makeMigration(3)];
      const applied: Migration[] = [];

      expect(() => MigrationValidator.validate(files, applied)).toThrow(
        "Missing migration between 1 and 3"
      );
    });
  });

  describe("validateHashes", () => {
    it("throws on hash mismatch", () => {
      const files = [makeMigration(1, "correct-hash")];
      const applied = [makeMigration(1, "wrong-hash")];

      expect(() => MigrationValidator.validate(files, applied)).toThrow(
        "Hash mismatch for migration 1"
      );
    });
  });
});
