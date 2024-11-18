import {
  cleanObject,
  getRouteFunction,
  toCamelCase,
  toPascalCase,
} from "@/lib/utils";
import { FetchController, InsertController } from "../ControllerOperations";

export function generateInsertingController(
  model: InsertController,
  type: "route" | "function",
) {
  model.modelName = toPascalCase(model.modelName);
  let controller = "";
  if (type === "route") {
    let innerCallbackFunctionParamName = model.modelName
      .toLocaleLowerCase()
      .replace("model", "");
    let outerFunction = getRouteFunction(
      innerCallbackFunctionParamName,
      "post",
    );
    let modelNameWithoutS = model.modelName.endsWith("s")
      ? model.modelName.slice(0, -1)
      : model.modelName;
    outerFunction = outerFunction.replace(
      `_$_`,
      `
           try {
        const { ${modelNameWithoutS.toLocaleLowerCase()} } = req.body;

        const inserted_${modelNameWithoutS.toLocaleLowerCase()} = new ${model.modelName}(${modelNameWithoutS.toLocaleLowerCase()});

        await inserted_${modelNameWithoutS.toLocaleLowerCase()}.save();

        res.status(201).json({
            success: true,
            message: '${modelNameWithoutS.toLocaleLowerCase()} created successfully',
            inserted_${modelNameWithoutS.toLocaleLowerCase()},
        });
    } catch (error) {
        console.error(error); 

        res.status(400).json({
            success: false,
            message: 'Error creating ${modelNameWithoutS}',
            error: error.message,
        });
    }
        `,
    );
    controller += outerFunction;
  } else if (type === "function") {
    let innerCallbackFunctionParamName = model.modelName
      .toLocaleLowerCase()
      .replace("model", "");
    let outerFunction = getOuterFunction(model);
    let modelNameWithoutS = model.modelName.endsWith("s")
      ? model.modelName.slice(0, -1)
      : model.modelName;

    outerFunction = outerFunction.replace(
      `_$_`,
      `
           try {
        const { ${modelNameWithoutS.toLocaleLowerCase()} } = req.body;

        const inserted_${modelNameWithoutS.toLocaleLowerCase()} = new ${model.modelName}(${modelNameWithoutS.toLocaleLowerCase()});

        await inserted_${modelNameWithoutS.toLocaleLowerCase()}.save();

       return inserted_${modelNameWithoutS.toLocaleLowerCase()};
        
    } catch (error) {
        console.error(error); 

       return new Error("Error inserting ${modelNameWithoutS.toLocaleLowerCase()}");
    }
        `,
    );
    controller += outerFunction;
  } else {
    console.log("[insert controllers] if this logs, it means u r braindead");
  }
  return controller;
}

function getOuterFunction(model: InsertController) {
  let functionName = "";
  let modelNameWithS = model.modelName.endsWith("s")
    ? model.modelName
    : model.modelName + "s";
  let modelNameWithoutS = model.modelName.endsWith("s")
    ? model.modelName.slice(0, -1)
    : model.modelName;

  if (model.insertMany) {
    functionName = `insert multiple ${modelNameWithS}`;
  } else {
    functionName = `insert ${modelNameWithoutS}`;
  }
  functionName = toCamelCase(functionName);
  return `
		const ${functionName} = async () => {
			_$_
		};
    `;
}
