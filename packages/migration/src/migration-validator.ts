import { Migration } from './types';

export class MigrationValidator {
    static validate(files: Migration[], applied: Migration[]): void {
        this.validateSequence(files);
        this.validateHashes(files, applied);
    }

    private static validateSequence(migrations: Migration[]): void {
        migrations.forEach((migration, index) => {
            if (migration.id !== index + 1) {
                throw new Error(`Missing migration between ${index} and ${migration.id}`);
            }
        });
    }

    private static validateHashes(files: Migration[], applied: Migration[]): void {
        applied.forEach(appliedMigration => {
            const file = files.find(f => f.id === appliedMigration.id);
            if (!file) throw new Error(`Missing migration ${appliedMigration.id}`);
            if (file.hash !== appliedMigration.hash) {
                throw new Error(`Hash mismatch for migration ${appliedMigration.id}`);
            }
        });
    }
}