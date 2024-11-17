import {
  cleanObject,
  getRouteFunction,
  toCamelCase,
  toPascalCase,
} from "@/lib/utils";
import { FetchController } from "../ControllerOperations";

export function generateFetchingController(
  model: FetchController,
  type: "route" | "function",
) {
  model.modelName = toPascalCase(model.modelName);
  let controller = "";
  if (type === "route") {
    let innerCallbackFunctionParamName = model.modelName
      .toLocaleLowerCase()
      .replace("model", "");
    let outerFunction = getRouteFunction(innerCallbackFunctionParamName, "get");

    outerFunction = outerFunction.replace(
      `_$_`,
      `
        try {
            const ${innerCallbackFunctionParamName} = await ${model.modelName}.${model.findOne ? "findOne" : "find"}(${model.findAll ? "{}" : model.query ? JSON.stringify(model.query) : "{}"})${model.sort ? `.sort(${JSON.stringify(model.sort)})` : ""}${model.limit ? `.limit(${model.limit})` : ""}; 
            res.json(${innerCallbackFunctionParamName});
        } catch (err) {
            res.status(500).send(err);
        }
        `,
    );
    controller += outerFunction;
  } else if (type === "function") {
    let innerCallbackFunctionParamName = model.modelName
      .toLocaleLowerCase()
      .replace("model", "");
    let outerFunction = getOuterFunction(model);

    outerFunction = outerFunction.replace(
      `_$_`,
      `
        try {
            const ${innerCallbackFunctionParamName} = await ${model.modelName}.${model.findOne ? "findOne" : "find"}(${model.findAll ? "{}" : model.query ? JSON.stringify(model.query) : "{}"})${model.sort ? `.sort(${JSON.stringify(model.sort)})` : ""}${model.limit ? `.limit(${model.limit})` : ""}; 
            return (${innerCallbackFunctionParamName});
        } catch (err) {
            throw new Error('Error fetching ${innerCallbackFunctionParamName.endsWith("s") ? innerCallbackFunctionParamName : innerCallbackFunctionParamName + "s"}: ' + err.message);
        }
        `,
    );
    controller += outerFunction;
  } else {
    console.log("[fetch controllers] if this logs, it means u r braindead");
  }
  return controller;
}

function getOuterFunction(model: FetchController) {
  let functionName = "";
  let modelNameWithS = model.modelName.endsWith("s")
    ? model.modelName
    : model.modelName + "s";
  let modelNameWithoutS = model.modelName.endsWith("s")
    ? model.modelName.slice(0, -1)
    : model.modelName;
  if (model.findAll) {
    functionName = `get All ${modelNameWithS}`;
  } else if (model.query || model.findOne) {
    let cleanedObject = cleanObject(model.query);
    let firstQuery = Object.keys(cleanedObject)[0] ?? "";
    let secondQuery = Object.keys(cleanedObject)[1] ?? "";
    if (model.findOne) {
      functionName = `get ${modelNameWithoutS} ${firstQuery ? `By ${firstQuery}` : ""} ${secondQuery ? `And ${secondQuery}` : ""}`;
    } else {
      functionName = `get ${modelNameWithS}  ${firstQuery ? `With ${firstQuery}` : ""} ${secondQuery ? `And ${secondQuery}` : ""} `;
    }
    if (model.sort) {
      functionName += " sorted";
    }
  } else {
    functionName = `get ${modelNameWithS}`;
  }
  functionName = toCamelCase(functionName);
  return `
		const ${functionName} = async () => {
			_$_
		};
    `;
}
