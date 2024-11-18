import { beautifyAndRemoveEmptyLines } from "../utils";
import { FetchController, InsertController } from "./ControllerOperations";
import { generateFetchingController } from "./Fetch/generateFetchingController";
import { generateInsertingController } from "./Insert/generateInsertingController";

export function generateController(
  reqType: "fetch" | "insert",
  input: FetchController | InsertController,
  type: "route" | "function",
) {
  let controller = "";
  if (reqType === "fetch") {
    controller = generateFetchingController(input, type);
  } else if (reqType === "insert") {
    controller = generateInsertingController(input, type);
  }

  return beautifyAndRemoveEmptyLines(controller);
}
