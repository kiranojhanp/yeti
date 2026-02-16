import { describe, it, expect } from "vitest";
import { PostgresGenerator } from "../index";
import type { Namespace } from "@yeti/parse";

describe("Identifier Quoting", () => {
  const generator = new PostgresGenerator();

  it("quotes schema name in CREATE SCHEMA", () => {
    const ast: Namespace[] = [
      {
        name: "public",
        entities: [],
        enums: [],
      },
    ];

    const sql = generator.generateSQL(ast);
    expect(sql).toContain('CREATE SCHEMA IF NOT EXISTS "public"');
  });

  it("quotes reserved word table name", () => {
    const ast: Namespace[] = [
      {
        name: "app",
        entities: [
          {
            name: "user",
            fields: [
              {
                name: "id",
                type: "serial",
                attributes: [{ name: "pk", params: [] }],
              },
            ],
          },
        ],
        enums: [],
      },
    ];

    const sql = generator.generateSQL(ast);
    expect(sql).toContain('"app"."user"');
  });

  it("quotes enum type reference with namespace", () => {
    const ast: Namespace[] = [
      {
        name: "app",
        entities: [
          {
            name: "posts",
            fields: [
              {
                name: "status",
                type: "PostStatus",
                attributes: [],
              },
            ],
          },
        ],
        enums: [
          {
            name: "PostStatus",
            values: ["draft", "published"],
          },
        ],
      },
    ];

    const sql = generator.generateSQL(ast);
    // Enum type in CREATE TYPE should be quoted
    expect(sql).toContain('"app"."PostStatus"');
    // Column definition should reference quoted enum type
    expect(sql).toContain('"status" "app"."PostStatus"');
  });

  it("quotes namespace in FK references", () => {
    const ast: Namespace[] = [
      {
        name: "app",
        entities: [
          {
            name: "posts",
            fields: [
              {
                name: "user_id",
                type: "integer",
                attributes: [{ name: "fk", params: ["> users.id"] }],
              },
            ],
          },
        ],
        enums: [],
      },
    ];

    const sql = generator.generateSQL(ast);
    expect(sql).toContain('"app"."posts"');
    expect(sql).toContain('"app"."users"');
  });
});
