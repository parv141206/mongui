import { Model } from "@/types/Models";
import { createModel } from "./createModel";

export function createAllModels(models: Model[], moduleType: "esm" | "cjs") {
  const allModels: string[] = [];
  allModels.push(
    `${moduleType === "esm" ? "import mongoose from 'mongoose';" : "const mongoose = require('mongoose');"}
${moduleType === "esm" ? "import { Schema } from 'mongoose';" : "const { Schema } = mongoose;"}
`,
  );

  models.forEach((model) => {
    allModels.push(createModel(model, moduleType));
  });

  return allModels;
}
