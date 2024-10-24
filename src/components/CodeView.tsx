import { createAllModels } from "@/lib/createAllModels";
import { Model } from "@/types/Models";
import React, { useEffect, useState } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css"; // Default Prism theme
import "dracula-prism/dist/css/dracula-prism.css"; // Import Dracula theme

export default function CodeView({
  models,
  setIsCodeViewOpen,
}: {
  models: Model[];
  setIsCodeViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [copy, setCopy] = useState(false);
  useEffect(() => {
    // Highlight code when models change
    Prism.highlightAll();
  }, [models]);

  return (
    <div>
      <div className="absolute top-0 z-20 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="h-[80%] overflow-y-scroll rounded-lg border border-white/20 bg-[#282a36] p-5">
          <div className="flex justify-between">
            <h1 className="text-3xl text-white">Heres your code!</h1>
            <button
              className={`rounded px-4 py-2 ${copy ? "bg-white text-black" : "border-white-700 border text-white"}`}
              onClick={() => {
                // @ts-ignore
                navigator.clipboard.writeText(createAllModels(models, "cjs"));
                setCopy(true);
                setTimeout(() => {
                  setCopy(false);
                }, 2000);
              }}
            >
              {copy ? "Copied!" : "Copy"}
            </button>
          </div>
          <CreateAllModelsOutput models={models} />
          <div className="mt-4 flex justify-between">
            <button
              className="rounded bg-green-700 px-4 py-2 text-white"
              onClick={() => setIsCodeViewOpen(false)}
            >
              Looks good!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeDisplay({ models }: { models: Model[] }) {
  return (
    <pre className="language-json bg-black">
      <code>{JSON.stringify(models, null, 2)}</code>
    </pre>
  );
}

function CreateAllModelsOutput({ models }: { models: Model[] }) {
  return (
    <div className="m-3 flex w-fit flex-col gap-3 rounded-lg p-5">
      {/* <StatusIndicators /> */}

      {/* <hr /> */}

      <pre className="language-javascript bg-black">
        <code>{createAllModels(models, "cjs")}</code>
      </pre>
    </div>
  );
}

function StatusIndicators() {
  return (
    <div className="flex gap-3 p-1">
      {["red", "yellow", "green"].map((color) => (
        <div
          key={color}
          className={`h-5 w-5 rounded-full bg-${color}-500`}
        ></div>
      ))}
    </div>
  );
}
