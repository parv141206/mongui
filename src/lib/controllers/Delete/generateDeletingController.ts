import {
  cleanObject,
  getRouteFunction,
  toCamelCase,
  toPascalCase,
} from "@/lib/utils";
import { DeleteController } from "../ControllerOperations";

export function generateDeletingController(
  model: DeleteController,
  type: "route" | "function",
) {
  model.modelName = toPascalCase(model.modelName);
  let controller = "";

  const innerCallbackFunctionParamName = model.modelName
    .toLowerCase()
    .replace("model", "");
  const modelNameWithoutS = model.modelName.endsWith("s")
    ? model.modelName.slice(0, -1)
    : model.modelName;

  if (type === "route") {
    let outerFunction = getRouteFunction(
      innerCallbackFunctionParamName,
      "delete",
    );

    outerFunction = outerFunction.replace(
      `_$_`,
      `
        try {

            const deleted${modelNameWithoutS} = await ${model.modelName}.findOneAndDelete(${model.query ? JSON.stringify(model.query) : `{ id: ${modelNameWithoutS.toLowerCase()} }`});

            res.status(200).json({
                success: true,
                message: '${modelNameWithoutS.toLowerCase()} deleted successfully',
                deleted${modelNameWithoutS}, 
            });
        } catch (error) {
            console.error(error); 

            res.status(400).json({
                success: false,
                message: 'Error deleting ${modelNameWithoutS.toLowerCase()}',
                error: error.message,
            });
        }
      `,
    );
    controller += outerFunction;
  } else if (type === "function") {
    let outerFunction = getOuterFunction(model);

    outerFunction = outerFunction.replace(
      `_$_`,
      `
        try {

            const deleted${modelNameWithoutS} = await ${model.modelName}.findOneAndDelete(${model.query ? JSON.stringify(model.query) : `{ id: ${modelNameWithoutS.toLowerCase()} }`});

            return deleted${modelNameWithoutS};
        } catch (error) {
            console.error(error); 

            throw new Error("Error deleting ${modelNameWithoutS.toLowerCase()}");
        }
      `,
    );
    controller += outerFunction;
  } else {
    console.log("[delete controllers] Invalid type specified.");
  }

  return controller;
}

function getOuterFunction(model: DeleteController) {
  let functionName = "";
  const modelNameWithS = model.modelName.endsWith("s")
    ? model.modelName
    : `${model.modelName}s`;
  const modelNameWithoutS = model.modelName.endsWith("s")
    ? model.modelName.slice(0, -1)
    : model.modelName;

  if (model.deleteMany) {
    functionName = `deleteMultiple${toPascalCase(model.modelName)}`;
  } else {
    if (model.query) {
      functionName = `delete ${modelNameWithoutS}`;
    } else {
      functionName = `delete ${modelNameWithS}`;
    }
  }

  functionName = toCamelCase(functionName);

  return `
    const ${functionName} = async () => {
        _$_
    };
  `;
}
