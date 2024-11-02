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
