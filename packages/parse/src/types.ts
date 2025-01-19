export type Namespace = {
  name: string;
  entities: Entity[];
  enums: Enum[];
};

export type Entity = {
  name: string;
  fields: Field[];
};

export type Field = {
  name: string;
  type: string;
  attributes: Attribute[];
};

export type Attribute = {
  name: string;
  params?: string[];
};

export type Enum = {
  name: string;
  values: string[];
};
