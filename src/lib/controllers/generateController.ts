import { beautifyAndRemoveEmptyLines } from "../utils";
import {
  DeleteController,
  FetchController,
  InsertController,
} from "./ControllerOperations";
import { generateDeletingController } from "./Delete/generateDeletingController";
import { generateFetchingController } from "./Fetch/generateFetchingController";
import { generateInsertingController } from "./Insert/generateInsertingController";

export function generateController(
  reqType: "fetch" | "insert" | "delete",
  input: FetchController | InsertController | DeleteController,
  type: "route" | "function",
) {
  let controller = "";
  if (reqType === "fetch") {
    controller = generateFetchingController(input, type);
  } else if (reqType === "insert") {
    //@ts-ignore
    controller = generateInsertingController(input, type);
  } else if (reqType === "delete") {
    //@ts-ignore
    controller = generateDeletingController(input, type);
  }

  return beautifyAndRemoveEmptyLines(controller);
}
