import { BaseSQLGenerator } from "@yeti/generator";
import { PostgresDialect } from "./dialect";
import { PostgresTemplates } from "./templates";

export class PostgresGenerator extends BaseSQLGenerator {
  constructor() {
    super(new PostgresDialect(), new PostgresTemplates());
  }

  protected supportsEnums(): boolean {
    return true;
  }
}
