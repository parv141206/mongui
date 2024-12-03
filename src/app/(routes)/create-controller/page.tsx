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
import { FaExclamation } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";

export default function CreateController() {
  const [modelName, setModelName] = useState("");
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [typeOfCode, setTypeOfCode] = useState<"route" | "function">("route");
  //const [findAll, setFindAll] = useState(true);
  const [findOne, setFindOne] = useState(false);
  //const [limit, setLimit] = useState("");
  const [copy, setCopy] = useState(false);
  const [operation, setOperation] = useState<"fetch" | "insert" | "delete">(
    "fetch",
  );
  const [code, setCode] = useState("");
  const [query, setQuery] = useState({ query: {} });

  const handleTypeChange = (value: "route" | "function") => {
    setTypeOfCode(value);
    generateExampleCode({ typeOfCode: value });
  };

  const handleOperationChange = (value: "fetch" | "insert" | "delete") => {
    setOperation(value);
    generateExampleCode({ operation: value });
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
        console.log(input.value);
        if (!isValidKeyValueFormat([input.value])) {
          console.log(isValidKeyValueFormat([input.value]));
          hasError = true;
          return;
        }
        console.log(input.value.split(":").map((item) => item.trim()));
        const [key, val] = input.value.split(":").map((item) => item.trim());
        if (key) {
          let numericValue =
            val && !isNaN(parseFloat(val))
              ? parseFloat(val)
              : val.replace(/"/g, "");
          newQuery[key] = numericValue;
        }
      }
    });

    if (!hasError) {
      console.log({ query: newQuery });
      setQuery({ query: newQuery });

      generateExampleCode({ query: newQuery });
    }
  };

  const addInput = () => {
    const newInputs = [...inputs, { id: Date.now(), value: "" }];
    setInputs(newInputs);
    generateExampleCode({ inputs: newInputs });
  };

  const removeInput = (id: number) => {
    const filteredInputs = inputs.filter((input) => input.id !== id);
    setInputs(filteredInputs);
    generateExampleCode({ inputs: filteredInputs });
  };

  const generateExampleCode = (
    overrides: Partial<{
      modelName: string;
      typeOfCode: "route" | "function";
      operation: "fetch" | "insert" | "delete";
      inputs: typeof inputs;
      query: (typeof query)["query"];
      findOne: boolean;
    }> = {},
  ) => {
    const finalModelName = overrides.modelName ?? modelName;
    const finalTypeOfCode = overrides.typeOfCode ?? typeOfCode;
    const finalOperation = overrides.operation ?? operation;
    //const finalInputs = overrides.inputs ?? inputs;
    const finalQuery = overrides.query ?? query.query;
    const finalFindOne = overrides.findOne ?? findOne;

    if (!finalModelName) return "Please provide a model name.";

    setCode(
      generateController(
        finalOperation,
        {
          modelName: finalModelName,
          query: finalQuery,
          findOne: finalFindOne,
          sort: {},
        },
        finalTypeOfCode,
      ),
    );
  };

  return (
    <div className="bg-black px-6 py-6">
      <div className="huge-code-text-without-size text-8xl text-white/80">
        Create <span className="text-green-500">Controllers</span>
      </div>
      <hr className="mb-3 mt-3 border border-white/50" />

      <div className="flex-row-4 flex rounded-lg text-white/80">
        <div className="w-full p-3">
          <div className="text-3xl">Enter name of your model</div>
          <input
            onChange={(e) => {
              const newName = e.target.value;
              setModelName(newName);
              generateExampleCode({ modelName: newName });
            }}
            type="text"
            className="controller-input"
            placeholder="Model Name"
          />
          {modelName === "" && (
            <p className="warning flex items-center gap-1 text-lg">
              <FaExclamation />
              Name of model is required
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-3xl text-white/80">
            Type of Operation{" "}
          </div>
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
          <div className="my-3 border-s border-green-400/25 p-5">
            {operation === "fetch" && (
              <div className="w-fit gap-3 rounded-br-2xl rounded-tr-2xl p-5 text-white/80">
                <div className="text-3xl">Additional Options</div>
                <hr className="mb-3 mt-3 border border-white/30" />
                <div className="warning">
                  ! Leave blank if you want to enable the FindAll option
                </div>

                <div className="text-xl">Queries</div>
                {inputs.map((input) => (
                  <div key={input.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder={`name : "cool"`}
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
                      onChange={() => {
                        const newValue = !findOne;
                        setFindOne(newValue);
                        generateExampleCode({ findOne: newValue });
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
            {operation === "delete" && (
              <>
                <div className="text-3xl">Additional Options</div>
                <hr className="mb-3 mt-3 border border-white/30" />

                <div className="text-xl">Queries</div>
                <div className="warning">
                  ! Leave blank if you want to enable the FindAll option
                </div>
                {inputs.map((input) => (
                  <div key={input.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder={`name : "cool"`}
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
              </>
            )}
          </div>
          <div className="mt-3 text-3xl text-white/80">Type of Output</div>
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

        <div className="mt-3 h-fit w-full rounded-xl border border-white/30 bg-black p-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl">No need to type now 😎</div>
            <button
              className={`button ${copy ? "text-white" : "text-gray-200"}`}
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopy(true);
                setTimeout(() => setCopy(false), 2000);
              }}
            >
              {copy ? "Copied!" : "Copy"}
            </button>
          </div>
          <hr className="mb-3 mt-3 border border-white/30" />
          <pre>
            <textarea
              value={code}
              rows={20}
              spellCheck={false}
              onChange={(e) => setCode(e.target.value)}
              className="mt-2 h-full w-full rounded-lg bg-black py-3 text-lg text-white/70"
            ></textarea>
          </pre>
        </div>
      </div>
    </div>
  );
}
