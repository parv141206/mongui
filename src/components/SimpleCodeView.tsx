"use client";
import { createAllModels } from "@/lib/createAllModels";
import { Model } from "@/types/Models";
import React, { useEffect, useState } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css"; // Default Prism theme
import "dracula-prism/dist/css/dracula-prism.css"; // Import Dracula theme

export default function CodeView({}: {}) {
  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl text-white">Get the auto-generated code</h1>
      </div>
      <CreateAllModelsOutput />
    </div>
  );
}

function CreateAllModelsOutput() {
  return (
    <div className="m-3 flex w-fit flex-col gap-3 rounded-lg p-5">
      <pre className="language-javascript">
        <code>
          {`
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Students = new Schema({
  eno: {
    type: number,
    required: true,
    unique: true,
  },
  personal_info: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'StdInfo',
  },
  grades: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'StdMarks',
  }
});
const StudentsModel = mongoose.model('Students', Students);
...
            `}
        </code>
      </pre>
    </div>
  );
}
