export type Location = {
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
};

export type YetiError = {
  message: string;
  loc?: Location;
  severity: "error" | "warning";
};

export type ParseResult = {
  ast: Namespace[];
  errors: YetiError[];
};

export type Namespace = {
  name: string;
  entities: Entity[];
  enums: Enum[];
  loc?: Location;
};

export type Entity = {
  name: string;
  fields: Field[];
  loc?: Location;
};

export type Field = {
  name: string;
  type: string;
  attributes: Attribute[];
  loc?: Location;
};

export type Attribute = {
  name: string;
  params: string[];
  loc?: Location;
};

export type Enum = {
  name: string;
  values: string[];
  loc?: Location;
};
