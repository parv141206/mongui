"use client";
import React, { useState } from "react";

export default function CreateController() {
  const [modelName, setModelName] = useState("");
  return (
    <div className="border border-white bg-black p-5 text-white">
      <div className="text-2xl">Please enter the name of your model:</div>
      <input
        onChange={(e) => setModelName(e.target.value)}
        type="text"
        className="controller-input"
        placeholder="Name"
      />
    </div>
  );
}
