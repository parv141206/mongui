"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateController() {
  const [modelName, setModelName] = useState("");
  const [typeOfCode, setTypeOfCode] = useState(""); // State to track selected type

  const handleTypeChange = (value) => {
    setTypeOfCode(value); // Update state with selected type
  };

  return (
    <div className="bg-black px-8 py-8">
      {/* Static Title */}
      <div className="huge-code-text mb-5 text-5xl text-white">
        Create <span className="text-green-500">Controllers</span>
      </div>
      <hr className="mb-7 border border-white" />

      {/* Two-column Layout */}
      <div className="flex-row-4 flex rounded-lg text-white">
        {/* Left Column - Input Section */}
        <div className="w-full p-5">
          <div className="text-3xl">Enter Name Of Your Model</div>
          <input
            onChange={(e) => setModelName(e.target.value)}
            type="text"
            className="controller-input mt-2 w-full"
            placeholder="Name"
          />

          <div className="mb-3 mt-3 text-3xl">Type of Code</div>
          <Select onValueChange={handleTypeChange}>
            <SelectTrigger className="w-fit space-x-1 text-2xl">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Route">Route</SelectItem>
              <SelectItem value="Function">Controller</SelectItem>
            </SelectContent>
          </Select>

          {/* Conditional rendering of additional options */}
          {typeOfCode && (
            <div className="mt-3 w-fit gap-3 rounded-md bg-zinc-800 p-5 text-white">
              <div className="text-3xl">Additional Options</div>
              <hr className="mb-3 mt-3 border border-white" />
              <div className="text-lg font-medium text-yellow-600">
                ! Leave blank if you don't want to add any additional options
              </div>
              <div className="text-xl">
                Following Section of Options for {typeOfCode}
              </div>
            </div>
          )}

          <button className="controller-button mt-5">Submit</button>
        </div>
        {/* Right Column - Filler Text Section */}
        <div className="w-full rounded-lg border border-white border-opacity-20 bg-zinc-800 bg-opacity-50 p-5 backdrop-blur-lg">
          <div className="mb-4 text-4xl font-medium">
            Auto-Generated Code Section
          </div>
          <hr className="mb-3 mt-3 border border-white" />
          <p className="text-white">
            This is a filler text area. You can add any relevant information or
            instructions here. For example, you might want to describe how to
            use the controller creation feature, provide examples, or include
            links to documentation.
          </p>
          <p className="mt-4 text-white">
            Feel free to customize this section with more details or additional
            components as needed.
          </p>
        </div>{" "}
      </div>
    </div>
  );
}
