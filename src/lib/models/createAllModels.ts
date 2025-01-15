import { Model } from "@/types/Models";
import { createModel } from "./createModel";

export function createAllModels(models: Model[], moduleType: "esm" | "cjs") {
  let AllModels: string[] = [];
  AllModels.push(
    `
${moduleType === "esm" ? "import mongoose from 'mongoose';" : "const mongoose = require('mongoose');"}
${moduleType === "esm" ? "import { Schema } from 'mongoose';" : "const { Schema } = mongoose;"}

`,
  );
  models.forEach((model) => {
    AllModels.push("\n");
    AllModels.push(createModel(model, moduleType));
  });
  return AllModels;
}
