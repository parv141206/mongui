import { Model } from "@/types/Models";
import { beautifyAndRemoveEmptyLines, toPascalCase } from "../utils";

export function createModel(model: Model, moduleType: "esm" | "cjs") {
  const formattedCollectionName = toPascalCase(model.collection_name);

  const fieldsString = model.fields
    .map((field) => {
      const fieldDef = {
        type:
          field.type === "ref"
            ? "Schema.Types.ObjectId"
            : field.type === "string"
              ? "String"
              : field.type === "number"
                ? "Number"
                : field.type === "boolean"
                  ? "Boolean"
                  : field.type === "date"
                    ? "Date"
                    : field.type === "object"
                      ? "Object"
                      : field.type === "array"
                        ? "Array"
                        : field.type,
        ...(field.required && { required: true }),
        ...(field.unique && { unique: true }),
        ...(field.type === "ref" &&
          field.ref && { ref: field.ref.collection_name }),
      };

      const fieldProps = Object.entries(fieldDef)
        .map(
          ([key, value]) =>
            `${key}: ${typeof value === "string" && key !== "type" ? `'${value}'` : value}`,
        )
        .join(",\n        ");

      return `${field.name}: {\n        ${fieldProps}\n    }`;
    })
    .join(",\n    ");

  const modelDefinition = `
const ${formattedCollectionName}Schema = new Schema({
    ${fieldsString}
});

const ${formattedCollectionName} = mongoose.model('${formattedCollectionName}', ${formattedCollectionName}Schema);
`;

  const formattedCode = beautifyAndRemoveEmptyLines(modelDefinition);

  if (moduleType === "esm") {
    return `${formattedCode}\n\nexport default ${formattedCollectionName};`;
  } else if (moduleType === "cjs") {
    return `${formattedCode}\n\nmodule.exports = ${formattedCollectionName};`;
  } else {
    throw new Error("Invalid module type. Use 'esm' or 'cjs'.");
  }
}
