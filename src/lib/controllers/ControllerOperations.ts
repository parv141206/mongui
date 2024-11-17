export type FetchController = {
  modelName: string;
  findAll?: boolean;
  query?: Object;
  findOne?: boolean;
  onlySpecifiedFields?: Array<string>;
  sort?: Object;
  limit?: number;
};
