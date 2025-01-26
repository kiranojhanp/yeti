import { readdirSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { Migration } from './types';

export class FileLoader {
    static loadMigrations(path: string): Migration[] {
        return readdirSync(path)
            .filter(file => /^\d+[-_].+\.(sql|js)$/.test(file))
            .sort((a, b) => this.getMigrationId(a) - this.getMigrationId(b))
            .map(file => ({
                id: this.getMigrationId(file),
                name: this.getMigrationName(file),
                content: readFileSync(`${path}/${file}`, 'utf8'),
                hash: createHash('sha256').update(readFileSync(`${path}/${file}`)).digest('hex'),
                file
            }));
    }

    private static getMigrationId(filename: string): number {
        const match = filename.match(/^(\d+)/);
        if (!match) throw new Error(`Invalid filename: ${filename}`);
        return parseInt(match[1], 10);
    }

    private static getMigrationName(filename: string): string {
        return filename
            .replace(/^\d+[-_]/, '')
            .replace(/\.(sql|js)$/, '')
            .replace(/[-_]/g, ' ');
    }
}