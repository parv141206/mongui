import React, { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { Checkbox } from "./Checkbox";

export default function InputControllerOptions({
  modelName,
}: {
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
    console.log({
      modelName: modelName,
      findAll: fetchOperationOptions.findAll,
      query: fetchOperationOptions.query,
      findOne: fetchOperationOptions.findOne,
      sort: fetchOperationOptions.sort,
      limit: fetchOperationOptions.limit,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-3xl">Enter query for fetching</div>
      <div className="text-sm text-blue-300">
        ! Leave blank if you want to fetch everything
      </div>

      {/* Query Inputs */}
      {inputs.map((input) => (
        <div key={input.id} className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`name = "cool"`}
            className="normal-input"
            value={input.value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
          <button
            onClick={() => removeInput(input.id)}
            className="rounded-lg bg-red-500 p-2 text-white"
            aria-label="Remove parameter"
          >
            <IoTrashBin className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button
        onClick={addInput}
        className="flex items-center rounded bg-blue-500 p-2 text-white"
        aria-label="Add parameter"
      >
        Add parameter
      </button>
      <Checkbox
        label="Enable Sorting"
        onChange={(checked) => {
          setSortState(checked);
        }}
        checked={sortState}
      />

      {/* Sort Inputs */}
      {sortState && (
        <>
          <div className="mt-5 text-3xl">Enter sorting options</div>

          {sortInputs.map((sortInput) => (
            <div key={sortInput.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`field`}
                className="normal-input"
                value={sortInput.field}
                onChange={(e) =>
                  handleSortChange(
                    sortInput.id,
                    e.target.value,
                    sortInput.direction,
                  )
                }
              />
              <select
                value={sortInput.direction}
                onChange={(e) =>
                  handleSortChange(
                    sortInput.id,
                    sortInput.field,
                    e.target.value,
                  )
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <button
                onClick={() => removeSortInput(sortInput.id)}
                className="rounded-lg bg-red-500 p-2 text-white"
                aria-label="Remove sorting parameter"
              >
                <IoTrashBin className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={addSortInput}
            className="flex items-center rounded bg-blue-500 p-2 text-white"
            aria-label="Add sorting parameter"
          >
            Add sorting parameter
          </button>
        </>
      )}
      {/* Fetch Options */}
      <div className="flex flex-col p-3">
        <Checkbox
          label="Find All"
          onChange={(checked) => {
            setFetchOperationOptions((prev) => ({
              ...prev,
              findAll: checked,
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
              findAll:
                fetchOperationOptions.findAll === true
                  ? false
                  : fetchOperationOptions.findAll,
            }));
          }}
          checked={fetchOperationOptions.findOne}
        />

        <label>Limit</label>
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
          className="normal-input"
          min={1}
        />
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
  );
}
