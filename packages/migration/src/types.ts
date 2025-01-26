export interface Migration {
    id: number;
    name: string;
    content: string;
    hash: string;
    file: string;
}

export interface MigrationResult {
    applied: Migration[];
    pending: Migration[];
}

export interface MigrationAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    lock<T>(fn: () => Promise<T>): Promise<T>;
    ensureMigrationsTable(): Promise<void>;
    getAppliedMigrations(): Promise<Migration[]>;
    applyMigration(migration: Migration & { sql: string }): Promise<void>;
}

export type AdapterConfig = {
    type: 'sqlite' | 'postgres';
    [key: string]: any;
};