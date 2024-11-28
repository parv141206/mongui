export type FetchController = {
  modelName: string | String;
  findAll?: boolean;
  query?: Object;
  findOne?: boolean;
  // onlySpecifiedFields?: Array<string>;
  sort?: Object;
  limit?: number;
};
export type InsertController = {
  modelName: string;
  insertMany?: boolean;
};
export type DeleteController = {
  modelName: string;
  query?: Array<String | string>;
  deleteMany?: boolean;
};
