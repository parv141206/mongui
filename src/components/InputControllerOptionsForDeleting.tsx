import React, { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { generateController } from "@/lib/controllers/generateController"; // Assuming this is your controller generator

export default function InputControllerOptionsForDeleting({
  setCode,
  modelName,
}: {
  setCode: (code: string) => void;
  modelName: string; // Changed to lowercase 'string' for consistency
}) {
  const [typeOfCode, setTypeOfCode] = useState<"route" | "function">("route");
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [deleteOperationOptions, setDeleteOperationOptions] = useState({
    query: {},
  });
  const handleInputChange = (id, value) => {
    setInputs(
      inputs.map((input) => (input.id === id ? { ...input, value } : input)),
    );

    const newQuery = {};
    inputs.forEach((input) => {
      if (input.value) {
        const [key, val] = input.value.split("=").map((item) => item.trim());
        if (key) {
          let numericValue;

          if (typeof val === "string" && val.trim() !== "") {
            const parsedValue = parseFloat(val);
            if (!isNaN(parsedValue)) {
              numericValue = parsedValue;
            } else {
              numericValue = val.replace(/"/g, "");
            }
          }

          if (numericValue !== undefined) {
            newQuery[key] = numericValue;
          }
        }
      }
    });

    // Assuming you have a state to hold the delete operation options
    setDeleteOperationOptions((prev) => ({
      ...prev,
      query: newQuery,
    }));
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
      query: inputs.reduce((acc, input) => {
        if (input.value) {
          const [key, val] = input.value.split("=").map((item) => item.trim());
          acc[key] = val;
        }
        return acc;
      }, {}),
      typeOfCode,
    };

    // Generate the delete controller code
    const code = generateController("delete", deleteOptions, typeOfCode);
    console.log(code);
    setCode(code);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-md p-5">
        <div className="flex flex-col gap-4 rounded-md border-2 border-red-300/20 p-5">
          <div className="text-3xl">Enter Delete Query</div>
          <hr className="border border-white/30" />
          <div className="text-md text-yellow-400">
            ! Leave blank if you want to delete everything
          </div>

          {/* Query Inputs */}
          {inputs.map((input) => (
            <div key={input.id} className="flex items-center gap-3">
              <input
                type="text"
                placeholder={`name = "cool"`}
                className="normal-input"
                value={input.value}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
              />
              <button
                onClick={() => removeInput(input.id)}
                className="rounded-sm bg-red-600 p-2 text-white"
                aria-label="Remove parameter"
              >
                <IoTrashBin className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={addInput}
            className="flex w-fit items-center rounded-lg border border-white/30 bg-black p-2 text-white hover:bg-red-300 hover:text-black"
            aria-label="Add parameter"
          >
            Add Parameter
          </button>
        </div>

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

        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
