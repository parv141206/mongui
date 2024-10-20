export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "object"
  | "array"
  | "ref";
export interface Field {
  name: string;
  type: DataType;
  ref?: Model | null;
  ref_field?: Field | null;
}
export interface Model {
  collection_name: string;
  fields: Field[];
}
