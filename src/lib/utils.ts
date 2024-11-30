import { clsx, type ClassValue } from "clsx";
import { js_beautify } from "js-beautify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCamelCase(input: string): string {
  const sanitizedInput = input.replace(/[^a-zA-Z0-9]+/g, " ");

  const words = sanitizedInput.trim().split(" ");

  const camelCased = words
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");

  if (!/^[a-z][a-zA-Z0-9]*$/.test(camelCased)) {
    throw new Error(`Invalid identifier: ${camelCased}`);
  }

  return camelCased;
}
export function toPascalCase(input: string): string {
  const sanitizedInput = input.replace(/[^a-zA-Z0-9]+/g, " ");

  const words = sanitizedInput.trim().split(" ");

  const pascalCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(pascalCased)) {
    throw new Error(`Invalid identifier: ${pascalCased}`);
  }

  return pascalCased;
}
export function beautifyAndRemoveEmptyLines(code: string): string {
  const cleanedCode = code
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");

  const options = {
    indent_size: 2,
    space_in_empty_paren: true,
  };

  return js_beautify(cleanedCode, options);
}
export function cleanObject(obj) {
  const cleanedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !key.includes("$")) {
      cleanedObj[key] = obj[key];
    }
  }

  return cleanedObj;
}
export function getRouteFunction(
  modelName: string,
  request: "get" | "post" | "delete",
) {
  return `
    app.${request}('/${modelName}', async (req, res) => {
        _$_
    })
    `;
}

export function isValidKeyValueFormat(arr: string[]): boolean {
  const regex = /^\s*[^:]+:\s*[^:]+$/;

  for (const str of arr) {
    if (!regex.test(str)) {
      return false;
    }
  }

  return true;
}
