import React, { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { Checkbox } from "./Checkbox";
import { generateController } from "@/lib/controllers/generateController";

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
    const code = generateController("insert", insertOptions, typeOfCode);
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
          <div className="text-3xl">Type of code</div>
          <select
            value={typeOfCode}
            onChange={(e) => setTypeOfCode(e.target.value)}
            className="normal-input w-fit"
          >
            <option value="route">Route</option>
            <option value="function">Controller</option>
          </select>
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
