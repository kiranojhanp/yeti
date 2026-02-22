# Yeti

> [!WARNING]
> This project is under active development and still in its early stages.
>
> - **Expect frequent changes:** The API, features, and structure will shift as the project matures.
> - **Bugs are likely:** You may hit unexpected issues or instability.
> - **Documentation is incomplete:** Some docs are missing or behind the code.
>
> Feedback is welcome as work continues.

---

**Yeti** is a lightweight database markup language for defining schemas and relationships. Write your entities, fields, constraints, and relationships in a concise, readable format — Yeti handles the SQL.

![Yeti code](./images/yeti-code.png)

---

## Features

- **Readable syntax** — schemas are plain text that reads like what it describes
- **Built-in constraints** — types, defaults, and relationships live in the schema
- **Relationship support** — one-to-one, one-to-many, and many-to-many work out of the box
- **Index definitions** — declare indexes directly on fields

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

## Contributing

Issues and pull requests are welcome.

---

## License

MIT
