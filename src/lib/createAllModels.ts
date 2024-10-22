import { Model } from "@/types/Models";
import { createModel } from "./createModel";

export function createAllModels(models: Model[]) {
  let AllModels: string[] = [];
  models.forEach((model) => {
    AllModels.push(createModel(model));
  });
  return AllModels;
}
