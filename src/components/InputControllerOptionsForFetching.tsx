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

export default function InputControllerOptionsForFetching({
  setCode,
  modelName,
}: {
  setCode: (code: string) => void;
  modelName: String;
}) {
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [sortInputs, setSortInputs] = useState([
    { id: Date.now(), field: "", direction: "asc" },
  ]);
  const [sortState, setSortState] = useState(false);
  const [fetchOperationOptions, setFetchOperationOptions] = useState({
    findAll: true,
    findOne: false,
    query: {},
    sort: {},
    limit: 100,
  });
  const [typeOfCode, setTypeOfCode] = useState<"route" | "function">("route");

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
    setFetchOperationOptions((prev) => ({
      ...prev,
      query: newQuery,
    }));
  };

  const handleSortChange = (id, field, direction) => {
    setSortInputs(
      sortInputs.map((sortInput) =>
        sortInput.id === id ? { ...sortInput, field, direction } : sortInput,
      ),
    );

    const newSort = {};
    sortInputs.forEach((sortInput) => {
      if (sortInput.field) {
        newSort[sortInput.field] = sortInput.direction === "asc" ? 1 : -1;
      }
    });

    setFetchOperationOptions((prev) => ({
      ...prev,
      sort: newSort,
    }));
  };

  const addInput = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const removeInput = (id) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const addSortInput = () => {
    setSortInputs([
      ...sortInputs,
      { id: Date.now(), field: "", direction: "asc" },
    ]);
  };

  const removeSortInput = (id) => {
    setSortInputs(sortInputs.filter((sortInput) => sortInput.id !== id));
  };

  const handleSubmit = () => {
    const fetchOptions = {
      modelName: modelName,
      findAll: fetchOperationOptions.findAll,
      query: fetchOperationOptions.query,
      findOne: fetchOperationOptions.findOne,
      sort: fetchOperationOptions.sort,
      limit: fetchOperationOptions.limit,
    };
    const code = generateController("fetch", fetchOptions, typeOfCode);
    console.log(code);
    setCode(code);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-md border border-black bg-stone-100 p-5">
        <div className="text-3xl text-black">Enter Fetch Query</div>
        <hr className="border border-black" />
        <div className="text-md font-medium text-red-500">
          ! Leave blank if you want to fetch everything
        </div>

        {/* Query Inputs */}
        {inputs.map((input) => (
          <div key={input.id} className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`name = "cool"`}
              className="normal-input-light"
              value={input.value}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
            />
            <button
              onClick={() => removeInput(input.id)}
              className="bg-trasparent rounded-sm p-1 text-white"
              aria-label="Remove parameter"
            >
              <IoTrashBin className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}

        <button
          onClick={addInput}
          className="button-light"
          aria-label="Add parameter"
        >
          Add Parameter
        </button>
      </div>
      <div className="flex flex-col gap-3 rounded-md border-2 border-black bg-white p-5 text-black">
        <Checkbox
          label="Enable Sort"
          onChange={(checked) => {
            setSortState(checked);
          }}
          checked={sortState}
        />

        {/* Sort Inputs */}
        {sortState && (
          <>
            <hr className="border border-black" />
            <div className="text-xl font-medium text-yellow-600">
              Edit Sorting Options
            </div>

            {sortInputs.map((sortInput) => (
              <div key={sortInput.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Field`}
                  className="normal-input-light"
                  value={sortInput.field}
                  onChange={(e) =>
                    handleSortChange(
                      sortInput.id,
                      e.target.value,
                      sortInput.direction,
                    )
                  }
                />
                <Select>
                  <SelectTrigger
                    className="text-md w-fit space-x-1 border border-gray-500 bg-white text-black"
                    value={sortInput.direction}
                    onChange={(e) =>
                      handleSortChange(
                        sortInput.id,
                        sortInput.field,
                        e.target.value,
                      )
                    }
                  >
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => removeSortInput(sortInput.id)}
                  className="bg-transaprent rounded-sm p-1 text-white"
                  aria-label="Remove sorting parameter"
                >
                  <IoTrashBin className="h-5 w-5 text-black" />
                </button>
              </div>
            ))}

            <button
              onClick={addSortInput}
              className="button-light"
              aria-label="Add sorting parameter"
            >
              Add Sort Parameter
            </button>
          </>
        )}
      </div>
      {/* Additional Options */}
      <div className="flex flex-col gap-3 rounded-md border-2 border-white/30 bg-white p-5 text-black">
        <div className="text-3xl">Additional Options</div>
        <hr className="border border-black" />

        <Checkbox
          label="Find All"
          onChange={(checked) => {
            setFetchOperationOptions((prev) => ({
              ...prev,
              findAll: checked,
              limit: checked ? undefined : fetchOperationOptions.limit,
              findOne:
                fetchOperationOptions.findOne === true
                  ? false
                  : fetchOperationOptions.findOne,
            }));
          }}
          checked={fetchOperationOptions.findAll}
        />
        <Checkbox
          label="Find One"
          onChange={(checked) => {
            setFetchOperationOptions((prev) => ({
              ...prev,
              findOne: checked,
              limit: checked ? undefined : fetchOperationOptions.limit,
              findAll:
                fetchOperationOptions.findAll === true
                  ? false
                  : fetchOperationOptions.findAll,
            }));
          }}
          checked={fetchOperationOptions.findOne}
        />
        <label>
          Limit{"   "}
          <span className="text-md mx-2 font-medium text-red-500">
            If you want to limit the number of results, disable findAll and
            findOne
          </span>
        </label>
        <input
          disabled={
            fetchOperationOptions.findAll || fetchOperationOptions.findOne
              ? true
              : false
          }
          type={
            fetchOperationOptions.findAll || fetchOperationOptions.findOne
              ? "text"
              : "number"
          }
          value={
            fetchOperationOptions.findAll || fetchOperationOptions.findOne
              ? "Disabled"
              : fetchOperationOptions.limit
          }
          onChange={(e) =>
            setFetchOperationOptions((prev) => ({
              ...prev,
              limit: Number(e.target.value),
            }))
          }
          className="normal-input-light w-fit"
          min={1}
        />
        <div className="flex text-xl">Type of Code</div>
        <Select>
          <SelectTrigger
            className="text-md w-fit space-x-1 border border-gray-500"
            value={typeOfCode}
            onChange={(e) => setTypeOfCode(e.target.value)}
          >
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent className="border border-gray-500">
            <SelectItem value="route">Route</SelectItem>
            <SelectItem value="functions">Controller</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        className="button-light"
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </button>
    </div>
  );
}
