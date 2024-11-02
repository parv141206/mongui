import { Model } from "@/types/Models";
import { js as beautify } from "js-beautify";
import { toPascalCase } from "./validateModelName";

const unformattedCode = `function example(){if(x){return el;}}`;
const options = {
  indent_size: 2,
  space_in_empty_paren: true,
};

const formattedCode = beautify(unformattedCode, options);
console.log(formattedCode);

function beautifyAndRemoveEmptyLines(code: string): string {
  const cleanedCode = code
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");

  const options = {
    indent_size: 2,
    space_in_empty_paren: true,
  };

  return beautify(cleanedCode, options);
}

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
const ${formattedCollectionName} = new Schema({
    ${fieldsString}
});

const ${formattedCollectionName}Model = mongoose.model('${formattedCollectionName}', ${formattedCollectionName});
`;

  const formattedCode = beautifyAndRemoveEmptyLines(modelDefinition);

  if (moduleType === "esm") {
    return `${formattedCode}\n\nexport default ${formattedCollectionName}Model;`;
  } else if (moduleType === "cjs") {
    return `${formattedCode}\n\nmodule.exports = ${formattedCollectionName}Model;`;
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
