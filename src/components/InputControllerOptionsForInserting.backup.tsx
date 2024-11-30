import React, { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { Checkbox } from "./Checkbox";
import { generateController } from "@/lib/controllers/generateController";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InputControllerOptionsForInserting({
  setCode,
  modelName,
}: {
  setCode: (code: string) => void;
  modelName: String;
}) {
  const [insertMultiple, setInsertMultiple] = useState(false);
  const [typeOfCode, setTypeOfCode] = useState<"route" | "function">("route");
  const handleSubmit = () => {
    const insertOptions = {
      modelName: modelName,
      insertMany: insertMultiple,
    };
    const code = generateController("insert", insertOptions, "function");
    console.log(code);
    setCode(code);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-md p-5">
        {/*<div className="text-3xl">
          <Checkbox
            label="Insert multiple at once"
            onChange={(checked) => {
              setInsertMultiple(checked);
            }}
            checked={insertMultiple}
          />
        </div>
            */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">Type of Code</div>
          <Select>
            <SelectTrigger
              className="text-md w-fit space-x-1"
              value={typeOfCode}
              onChange={(e) => setTypeOfCode("route")}
            >
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route">Route</SelectItem>
              <SelectItem value="function">Controller</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          className="button"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
