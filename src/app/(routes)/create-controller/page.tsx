"use client";
import { Checkbox } from "@/components/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateController } from "@/lib/controllers/generateController";
import { isValidKeyValueFormat } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { IoTrashBin } from "react-icons/io5";

export default function CreateController() {
  const [modelName, setModelName] = useState("");
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [typeOfCode, setTypeOfCode] = useState<"route" | "function">("route");
  const [findAll, setFindAll] = useState(true);
  const [findOne, setFindOne] = useState(false);
  const [limit, setLimit] = useState("");
  const [copy, setCopy] = useState(false);
  const [operation, setOperation] = useState<
    "fetch" | "create" | "update" | "delete"
  >("fetch");
  const [code, setCode] = useState("");
  const [query, setQuery] = useState({ query: {} });
  const handleTypeChange = (value) => {
    setTypeOfCode(value);
    generateExampleCode();
  };
  const handleOperationChange = (value) => {
    setOperation(value);

    generateExampleCode();
  };
  const handleInputChange = (id: number, value: string) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value } : input,
    );

    setInputs(updatedInputs);

    let newQuery: Record<string, any> = {};
    let hasError = false;

    updatedInputs.forEach((input) => {
      if (input.value) {
        // Validate the input format
        console.log(input.value);
        if (!isValidKeyValueFormat([input.value])) {
          hasError = true;
          return;
        }

        const [key, val] = input.value.split("=").map((item) => item.trim());
        if (key) {
          let numericValue;
          if (typeof val === "string" && val.trim() !== "") {
            const parsedValue = parseFloat(val);
            numericValue = !isNaN(parsedValue)
              ? parsedValue
              : val.replace(/"/g, "");
          }
          if (numericValue !== undefined) {
            newQuery[key] = numericValue;
          }
        }
      }
    });
    console.log(hasError);
    if (!hasError) {
      setQuery((prev) => ({
        ...prev,
        query: newQuery,
      }));
      generateExampleCode();
    }
  };
  const addInput = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };
  const removeInput = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const generateExampleCode = () => {
    if (!modelName) return "Please provide a model name.";
    console.log({
      modelName,
      findAll: findAll,
      query: query.query,
      findOne: findOne,
      sort: {},
    });
    setCode(
      generateController(
        "fetch",
        {
          modelName,
          findAll: findAll,
          query: query.query,
          findOne: findOne,
          sort: {},
        },
        typeOfCode,
      ),
    );
  };

  return (
    <div className="bg-black px-6 py-6">
      {/* Static Title */}
      <div className="huge-code-text-without-size text-8xl text-white">
        Create <span className="text-green-500">Controllers</span>
      </div>
      <hr className="mb-3 mt-3 border border-white/50" />

      {/* Two-column Layout */}
      <div className="flex-row-4 flex rounded-lg text-white">
        {/* Left Column - Input Section */}
        <div className="w-full p-3">
          <div className="text-4xl">Enter name of your model</div>
          <input
            onChange={(e) => {
              generateExampleCode();
              setModelName(e.target.value);
            }}
            type="text"
            className="controller-input"
            placeholder="Model Name"
          />

          <div className="mt-3 text-3xl">Type of Operation</div>
          {modelName === "" && (
            <p className="text-lg text-yellow-600">
              ! Name of model is required
            </p>
          )}
          <Select onValueChange={handleOperationChange} disabled={!modelName}>
            <SelectTrigger className="mt-2 w-fit space-x-1 border-white/30 text-2xl">
              <SelectValue placeholder={"Select Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fetch">Fetch</SelectItem>
              <SelectItem value="insert">Insert</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>

          <>
            {operation === "fetch" && (
              <>
                <div className="mt-3 w-fit gap-3 rounded-br-md rounded-tr-md border-l-2 border-lime-400/30 bg-white/5 p-5 text-white">
                  <div className="text-3xl">Additional Options</div>
                  <hr className="mb-3 mt-3 border border-white/30" />
                  <div className="text-md font-medium text-yellow-600">
                    ! Leave blank if you don't want to add any additional
                    options
                  </div>
                  {inputs.map((input) => (
                    <div key={input.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder={`name = "cool"`}
                        className="normal-input mt-2"
                        value={input.value}
                        onChange={(e) =>
                          handleInputChange(input.id, e.target.value)
                        }
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
                    className="button mt-2"
                    aria-label="Add parameter"
                  >
                    Add Parameter
                  </button>
                  <div className="mt-5">
                    <label className="mt-2 flex items-center">
                      <Checkbox
                        label="Find One"
                        checked={findOne}
                        onChange={() => setFindOne(!findOne)}
                      />
                    </label>
                  </div>
                </div>
              </>
            )}
          </>
          <div className="mt-3 text-3xl">Type of Output</div>
          {modelName === "" && (
            <p className="mb-2 mt-1 text-lg text-yellow-600">
              ! Name of model is required
            </p>
          )}
          <Select onValueChange={handleTypeChange} disabled={!modelName}>
            <SelectTrigger className="mt-2 w-fit space-x-1 border-white/30 text-2xl">
              <SelectValue placeholder={"Select Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route">Route</SelectItem>
              <SelectItem value="function">Function</SelectItem>
            </SelectContent>
          </Select>

          <Link href={"/new"}>
            <button className="controller-button">Return to Models</button>
          </Link>
        </div>

        {/* Right Column - Code Section */}
        <div className="mt-3 h-fit w-full rounded-lg border border-white/30 bg-black p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-3xl">No need to type now 😎</div>
            <button
              className={`button ${copy ? "text-white" : "text-gray-200"}`}
              onClick={() => {
                navigator.clipboard.writeText(generateExampleCode());
                setCopy(true);
                setTimeout(() => setCopy(false), 2000);
              }}
            >
              {copy ? "Copied!" : "Copy"}
            </button>
          </div>
          <hr className="mb-3 mt-3 border border-white/30" />
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
