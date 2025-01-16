import { createAllModels } from "@/lib/models/createAllModels";
import { Model } from "@/types/Models";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

function CreateAllModelsOutput({ models }: { models: Model[] }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [models]);

  return (
    <div className="w-full overflow-auto scroll-smooth">
      <pre className="rounded-lg bg-[#282a36] px-4 font-mono">
        <code className="language-typescript">
          {createAllModels(models, "cjs").join("\n")}
        </code>
      </pre>
    </div>
  );
}

export default function CodeView({
  models,
  setIsCodeViewOpen,
}: {
  models: Model[];
  setIsCodeViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [copy, setCopy] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="flex max-h-[90vh] w-fit min-w-[35vw] flex-col overflow-hidden rounded-sm border border-white/20 bg-[#282a36]">
          <div className="mt-3 flex justify-between border-b border-white/20 bg-[#282a36] px-3 py-2">
            <h1 className="futura text-4xl text-green-400">
              Here's your code!
            </h1>
            <div className="flex items-center justify-center">
              <button
                className="p-3 text-xl font-bold text-red-500 hover:text-red-400"
                onClick={() => setIsCodeViewOpen(false)}
              >
                <IoMdClose />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto">
            <CreateAllModelsOutput models={models} />
          </div>

          <div className="flex justify-between border-t border-white/10 bg-gradient-to-t from-[#282a36]/80 to-transparent p-4 backdrop-blur-sm">
            <button
              className="rounded-sm border border-[#50fa7b] bg-[#50fa7b] px-3 py-2 text-[#282a36] transition-all duration-300 hover:bg-[#282a36] hover:text-[#50fa7b]"
              onClick={() => setIsCodeViewOpen(false)}
            >
              Looks good!
            </button>
            <button
              className={`rounded border-2 border-[#6272a4] bg-[#6272a4] px-3 py-1 transition-all duration-500 hover:bg-transparent hover:text-white ${copy ? "text-black" : "text-black"}`}
              onClick={() => {
                navigator.clipboard.writeText(
                  createAllModels(models, "cjs").join("\n"),
                );
                setCopy(true);
                setTimeout(() => {
                  setCopy(false);
                }, 2000);
                setIsCodeViewOpen(false);
              }}
            >
              {copy ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
