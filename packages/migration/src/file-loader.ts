import { readdirSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import type { Migration } from "./types";

export class FileLoader {
  static loadMigrations(dirPath: string): Migration[] {
    return readdirSync(dirPath)
      .filter((file) => /^\d+[-_].+\.(sql|js)$/.test(file))
      .sort((a, b) => {
        const idA = parseInt(a.split(/[-_]/)[0]);
        const idB = parseInt(b.split(/[-_]/)[0]);
        return idA - idB;
      })
      .map((file) => {
        const fullPath = join(dirPath, file);
        const buffer = readFileSync(fullPath);
        const content = buffer.toString("utf8");
        const hash = createHash("sha256").update(buffer).digest("hex");
        return {
          id: parseInt(file.split(/[-_]/)[0]),
          name: file.replace(/\.(sql|js)$/, ""),
          content,
          hash,
          file: fullPath,
        };
      });
  }
}
