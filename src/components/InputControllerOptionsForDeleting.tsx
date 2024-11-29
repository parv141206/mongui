import React, { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { generateController } from "@/lib/controllers/generateController";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InputControllerOptionsForDeleting({
  setCode,
  modelName,
}: {
  setCode: (code: string) => void;
  modelName: string;
}) {
  const [typeOfCode, setTypeOfCode] = useState<"route" | "function">("route");
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [deleteOperationOptions, setDeleteOperationOptions] = useState({
    query: [],
  });
  const [error, setError] = useState("");

  const handleInputChange = (id, value) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value } : input,
    );

    setInputs(updatedInputs);

    let hasError = false;
    const newQueries = [];

    updatedInputs.forEach((input) => {
      if (input.value) {
        const [key, val] = input.value.split(":").map((item) => item.trim());

        if (input.value.includes("=")) {
          setError("Please use ':' instead of '='.");
          hasError = true;
          return;
        }

        if (!key || !val) {
          hasError = true;
          return;
        }

        newQueries.push(`${key}: ${val.replace(/"/g, "").trim()}`);
      }
    });

    if (!hasError) {
      setError("");
      setDeleteOperationOptions((prev) => ({
        ...prev,
        query: newQueries,
      }));
    }
  };

  const addInput = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const removeInput = (id) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const handleSubmit = () => {
    const deleteOptions = {
      modelName,
      query: deleteOperationOptions.query,
      typeOfCode,
    };

    console.log(deleteOptions);

    const code = generateController("delete", deleteOptions, typeOfCode);
    console.log(code);
    setCode(code);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-md p-5">
        <div className="flex flex-col gap-4 rounded-sm border border-red-500/70 p-5">
          <div className="text-3xl">Enter Delete Query</div>
          <hr className="border border-white/30" />
          <div className="text-md text-yellow-400/95">
            ! Leave blank if you want to delete everything
          </div>

          {error && <div className="text-red-500">{error}</div>}

          {inputs.map((input) => (
            <div key={input.id} className="flex items-center gap-3">
              <input
                type="text"
                placeholder={`name: "cool"`}
                className="normal-input"
                value={input.value}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
              />
              <button
                onClick={() => removeInput(input.id)}
                className="rounded-sm bg-red-500 p-2 text-white"
                aria-label="Remove parameter"
              >
                <IoTrashBin className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={addInput}
            className="flex w-fit items-center rounded-lg border border-white/30 bg-black p-2 text-white hover:bg-white hover:text-black"
            aria-label="Add parameter"
          >
            Add Parameter
          </button>
        </div>
        <div className="flex gap-3">
          <div className="text-3xl">Type of Code</div>
          <Select>
            <SelectTrigger
              className="text-md w-fit space-x-1"
              value={typeOfCode}
              onChange={(e) => setTypeOfCode(e.target.value)}
            >
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route">Route</SelectItem>
              <SelectItem value="functions">Controller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
