# Yeti

> [!WARNING]
> This project is under active development and is currently in its initial stages.
>
> - **Expect frequent changes:** The API, features, and overall structure may undergo significant modifications.
> - **Potential for bugs:** There may be unexpected bugs or stability issues.
> - **Limited documentation:** Documentation may be incomplete or outdated.
>
> We appreciate your understanding and welcome your feedback as we continue to improve this project.

---

**Yeti** is a lightweight and expressive database markup language designed for intuitive schema and relationship design. Yeti makes it easy to define entities, fields, relationships, and constraints in a concise format.

![Yeti code](./packages/vscode-plugin/images/yeti-code.png)

---

## Features

- **Human-Readable Syntax**: Define schemas in a way that is easy to write and understand.
- **Built-In Constraints**: Specify data types, defaults, constraints, and relationships directly in the schema.
- **Expressive Relationships**: Handle one-to-one, one-to-many, and many-to-many relationships effortlessly.
- **Index Support**: Define indexes on fields to optimize database performance.

---

## Example Schema

```yeti
namespace todo_app:

  # Users Table (for managing users)
  entity users:
    id: serial @pk
    username: varchar
    email: varchar @unique
    created_at: timestamp @default(now())

  # Tasks Table (for storing tasks)
  entity tasks:
    id: serial @pk
    user_id: integer @fk(> users.id)  # Relating tasks to users
    title: varchar
    description: text
    status: task_status  # Enum for task status
    created_at: timestamp @default(now())
    due_date: timestamp

  # Enum for task status
  enum task_status:
    pending
    in_progress
    completed
```

## Architecture & Workflow

Yeti transforms your schema definitions into production-ready SQL through a multi-step process involving lexical analysis, parsing, and dialect-specific code generation.

```mermaid
graph TD
    Input[Yeti Schema .yeti] -->|Input String| Parser(YetiParser)
    Parser -->|Parse| AST{AST Construction}
    AST -->|Namespace[]| Generator[Generator Strategy]
    Generator -->|Use Dialect| PG[PostgresGenerator]
    Generator -->|Use Dialect| SQLite[SQLiteGenerator]
    PG -->|Generate| SQL_PG[Postgres SQL]
    SQLite -->|Generate| SQL_SQLITE[SQLite SQL]
```

### 1. Parsing Phase (`@yeti/parse`)

The parsing process begins with the `YetiParser` class, which takes raw Yeti schema strings as input.

- **Line-by-Line Processing**: The parser iterates through the input line by line, filtering out comments and handling indentation to determine scope.
- **Regex Matching**: Specialized regular expressions identify key structures:
  - **Namespaces**: `namespace name:`
  - **Entities**: `entity name:`
  - **Enums**: `enum name:`
  - **Attributes**: `@attribute(params)`
- **AST Construction**: The parser builds an Abstract Syntax Tree (AST) consisting of `Namespace` objects, which contain `Entity` and `Enum` definitions, along with their fields and attributes.

### 2. Code Generation (`@yeti/generator`)

The generation phase transforms the AST into database-specific SQL.

- **Generator Strategy**: The `BaseSQLGenerator` abstract class defines the core logic for traversing the AST.
- **Dialect & Templates**: Implementations like `PostgresGenerator` provide specific `SQLDialect` and `TemplateProvider` strategies to handle database-specific syntax (e.g., data types, quoting rules).
- **Output**: The generator iterates through namespaces, entities, and enums to produce the final DDL (Data Definition Language) SQL strings, including tables, foreign keys, and indexes.

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve Yeti.

---

## License

Yeti is open-source software licensed under the MIT License.
