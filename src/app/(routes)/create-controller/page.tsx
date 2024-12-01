"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Checkbox } from "@/components/Checkbox";

export default function CreateController() {
  const [modelName, setModelName] = useState("");
  const [typeOfCode, setTypeOfCode] = useState(""); // State to track selected type
  const [findAll, setFindAll] = useState(true); // Set findAll checkbox checked by default
  const [findOne, setFindOne] = useState(false); // State for findOne checkbox
  const [limit, setLimit] = useState(""); // State for limit input
  const [copy, setCopy] = useState(false);

  const handleTypeChange = (value) => {
    setTypeOfCode(value); // Update state with selected type
    // Reset checkboxes and limit when type changes
    setFindAll(true); // Keep findAll checked by default
    setFindOne(false);
    setLimit("");
  };

  const generateExampleCode = () => {
    if (!modelName) return "Please provide a model name.";

    if (typeOfCode === "Route") {
      return `
import express from 'express';
import ${modelName} from '../models/${modelName}';

const router = express.Router();

// Create a new ${modelName}
router.post('/${modelName}', async (req, res) => {
    try {
        const newItem = new ${modelName}(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ${modelName}', error });
    }
});

export default router;
      `;
    }

    if (typeOfCode === "Function") {
      return `
import { Request, Response } from 'express';
import ${modelName} from '../models/${modelName}';

// Get all items
${
  findAll
    ? `
export const getAll${modelName}s = async (req: Request, res: Response) => {
    try {
      //Limit Section
        let query = ${modelName}.find();
        ${limit ? `query = query.limit(${limit});` : ""}
        const items = await query;
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ${modelName}s', error });
    }
};`
    : ""
}

// Get one item by ID
${
  findOne
    ? `
export const get${modelName}ById = async (req: Request, res: Response) => {
    try {
        const item = await ${modelName}.findById(req.params.id);
        if (!item) {
            res.status(404).json({ message: '${modelName} not found' });
        } else {
            res.status(200).json(item);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ${modelName}', error });
    }
};`
    : ""
}

// Create a new item
export const create${modelName} = async (req: Request, res: Response) => {
    try {
        const newItem = new ${modelName}(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ${modelName}', error });
    }
};
      `;
    }
    return "Select a type to see example code.";
  };

  return (
    <div className="bg-black px-8 py-8">
      {/* Static Title */}
      <div className="huge-code-text mb-5 text-5xl text-white">
        Create <span className="text-green-500">Controllers</span>
      </div>
      <hr className="mb-6 border border-white/50" />

      {/* Two-column Layout */}
      <div className="flex-row-4 flex rounded-lg text-white">
        {/* Left Column - Input Section */}
        <div className="w-full p-5">
          <div className="text-4xl">Enter name of your model</div>
          <input
            onChange={(e) => setModelName(e.target.value)}
            type="text"
            className="controller-input"
            placeholder="Model Name"
          />

          <div className="text-4xl">Type of code</div>
          <p className="py-2 text-lg text-yellow-600">
            ! Name of model is required
          </p>

          <Select onValueChange={handleTypeChange} disabled={!modelName}>
            <SelectTrigger className="w-fit space-x-1 border-white/30 text-2xl">
              <SelectValue placeholder={"Select Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Route">Route</SelectItem>
              <SelectItem value="Function">Controller</SelectItem>
            </SelectContent>
          </Select>

          {typeOfCode === "Function" && (
            <>
              <div className="mt-3 w-fit gap-3 rounded-md bg-stone-950 p-5 text-white">
                <div className="text-3xl">Controller Options</div>
                <hr className="mb-3 mt-3 border border-white/30" />
                <div className="text-md font-medium text-yellow-600">
                  ! Leave blank if you don't want to add any additional options
                </div>
                <div className="mt-5">
                  <label className="flex items-center">
                    <Checkbox
                      label="Find All"
                      checked={findAll}
                      onChange={() => setFindAll(!findAll)}
                      disabled={!!limit}
                    />
                  </label>
                  <label className="mt-2 flex items-center">
                    <Checkbox
                      label="Find One"
                      checked={findOne}
                      onChange={() => setFindOne(!findOne)}
                      disabled={!!limit}
                    />
                  </label>
                </div>

                <div className="mt-3">
                  <label htmlFor="limit" className="text-md">
                    Limit
                  </label>
                  <input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => {
                      setLimit(e.target.value);
                      if (e.target.value) {
                        setFindAll(true);
                      }
                    }}
                    className="normal-input mt-2 w-full"
                    placeholder="Enter limit"
                  />
                </div>
              </div>
            </>
          )}

          <Link href={"/new"}>
            <button className="controller-button">Return to Models</button>
          </Link>
        </div>

        {/* Right Column - Code Section */}
        <div className="w-full rounded-lg border border-white/30 bg-black p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-3xl font-medium">No need to type now 😎</div>
            <button
              className={`rounded px-4 py-2 ${copy ? "text-white" : "text-gray-200"}`}
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
            <code>{generateExampleCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
