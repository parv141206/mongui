import { Model } from "@/types/Models";
import { js as beautify } from "js-beautify";

const unformattedCode = `function example(){if(x){return el;}}`;
const options = {
  indent_size: 2,
  space_in_empty_paren: true,
};

const formattedCode = beautify(unformattedCode, options);
console.log(formattedCode);

function beautifyAndRemoveEmptyLines(code: string): string {
  // Remove empty lines
  const cleanedCode = code
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");

  // Beautify the cleaned code
  const options = {
    indent_size: 2,
    space_in_empty_paren: true,
  };

  return beautify(cleanedCode, options);
}

export function createModel(model: Model, moduleType: "esm" | "cjs") {
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
const ${model.collection_name} = new Schema({
    ${fieldsString}
});

const ${model.collection_name}Model = mongoose.model('${model.collection_name}', ${model.collection_name});
`;

  const formattedCode = beautifyAndRemoveEmptyLines(modelDefinition);

  // Conditional export based on moduleType
  if (moduleType === "esm") {
    return `${formattedCode}\n\nexport default ${model.collection_name}Model;`;
  } else if (moduleType === "cjs") {
    return `${formattedCode}\n\nmodule.exports = ${model.collection_name}Model;`;
  } else {
    throw new Error("Invalid module type. Use 'esm' or 'cjs'.");
  }
}

// Example usage:
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
    "esm", // Change to 'cjs' for CommonJS format
  ),
);
