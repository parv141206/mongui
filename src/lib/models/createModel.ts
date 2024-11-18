import { Model } from "@/types/Models";
import { beautifyAndRemoveEmptyLines, toPascalCase } from "../utils";

export function createModel(model: Model, moduleType: "esm" | "cjs") {
  const formattedCollectionName = toPascalCase(model.collection_name);

  const fieldsString = model.fields
    .map((field) => {
      return `${field.name}: {
        type: ${field.type === "ref" ? "Schema.Types.ObjectId" : field.type},
        ${field.required ? "required: true," : ""}
        ${field.unique ? "unique: true," : ""}
        ${field.type === "ref" ? `ref: '${field.ref?.collection_name}',` : ""}
    }`;
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

console.log(
  createModel(
    {
      collection_name: "First",
      fields: [
        {
          name: "Name",
          type: "string",
          ref: null,
          ref_field: null,
        },
        {
          name: "password",
          type: "ref",
          ref: {
            collection_name: "Second",
            fields: [
              {
                name: "password",
                type: "string",
                ref: null,
                ref_field: null,
              },
            ],
          },
          ref_field: {
            name: "password",
            type: "string",
            ref: null,
            ref_field: null,
          },
        },
      ],
    },
    "esm",
  ),
);
