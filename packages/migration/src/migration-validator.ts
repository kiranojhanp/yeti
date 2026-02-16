import { Migration } from "./types";

export class MigrationValidator {
  static validate(files: Migration[], applied: Migration[]): void {
    this.validateSequence(files);
    this.validateAppliedContiguous(applied);
    this.validateHashes(files, applied);
  }

  private static validateAppliedContiguous(applied: Migration[]): void {
    for (let i = 0; i < applied.length; i++) {
      if (applied[i].id !== i + 1) {
        throw new Error(
          `Applied migrations are not contiguous: expected id ${i + 1}, found ${applied[i].id}`
        );
      }
    }
  }

  private static validateSequence(migrations: Migration[]): void {
    migrations.forEach((migration, index) => {
      if (migration.id !== index + 1) {
        throw new Error(
          `Missing migration between ${index} and ${migration.id}`
        );
      }
    });
  }

  private static validateHashes(
    files: Migration[],
    applied: Migration[]
  ): void {
    applied.forEach((appliedMigration) => {
      const file = files.find((f) => f.id === appliedMigration.id);
      if (!file) throw new Error(`Missing migration ${appliedMigration.id}`);
      if (file.hash !== appliedMigration.hash) {
        throw new Error(`Hash mismatch for migration ${appliedMigration.id}`);
      }
    });
  }
}
