import { createAllModels } from "@/lib/createAllModels";
import { Model } from "@/types/Models";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

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
    // Prism.highlightAll();
  }, [models]);

  return (
    <div>
      <div className="absolute top-0 z-20 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="border-white/20s bg-[#282a36]s relative h-[80%] overflow-y-scroll rounded-lg border bg-black">
          <div
            style={{
              background:
                "linear-gradient(to bottom, black,black ,  transparent)",
            }}
            className="sticky top-0 flex justify-between p-5"
          >
            <h1 className="text-3xl text-white">Heres your code!</h1>
            <div className="flex items-center justify-center gap-1">
              <button
                className={`rounded px-4 py-2 ${copy ? "text-white" : "text-gray-200"}`}
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
              <button
                className="text-xl font-bold"
                onClick={() => setIsCodeViewOpen(false)}
              >
                <IoMdClose />
              </button>
            </div>
          </div>
          <CreateAllModelsOutput models={models} />
          <div className="m-5 mt-4 flex justify-between">
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

      <pre className="bg-black">
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
